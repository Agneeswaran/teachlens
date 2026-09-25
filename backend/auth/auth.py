"""
TeachLens Authentication and Authorization Middleware.
Handles token sessions, password hashing, and role-based access control.
"""

import secrets
from datetime import datetime, timezone, timedelta
from typing import Optional, Dict, Any
from fastapi import Header, HTTPException, status, Depends
from backend.database.db import get_connection

TOKEN_EXPIRY_DAYS = 7

def create_session(user_id: str) -> str:
    token = secrets.token_hex(32)
    now = datetime.now(timezone.utc)
    expires_at = (now + timedelta(days=TOKEN_EXPIRY_DAYS)).isoformat()
    
    conn = get_connection()
    c = conn.cursor()
    c.execute(
        "INSERT INTO sessions (token, user_id, created_at, expires_at) VALUES (?, ?, ?, ?)",
        (token, user_id, now.isoformat(), expires_at)
    )
    conn.commit()
    conn.close()
    return token

def delete_session(token: str):
    conn = get_connection()
    c = conn.cursor()
    c.execute("DELETE FROM sessions WHERE token = ?", (token,))
    conn.commit()
    conn.close()

def get_user_by_token(token: str) -> Optional[Dict[str, Any]]:
    conn = get_connection()
    c = conn.cursor()
    c.execute("""
        SELECT u.id, u.email, u.name, u.role, s.expires_at,
               tp.status as teacher_status, tp.institution as teacher_institution,
               sp.display_name, sp.streak_days, sp.comeback_points, sp.privacy_level
        FROM sessions s
        JOIN users u ON s.user_id = u.id
        LEFT JOIN teacher_profiles tp ON u.id = tp.user_id
        LEFT JOIN student_profiles sp ON u.id = sp.user_id
        WHERE s.token = ?
    """, (token,))
    row = c.fetchone()
    conn.close()

    if not row:
        return None

    # Check expiration
    expires_at = datetime.fromisoformat(row["expires_at"])
    if datetime.now(timezone.utc) > expires_at:
        delete_session(token)
        return None

    return {
        "id": row["id"],
        "email": row["email"],
        "name": row["name"],
        "role": row["role"],
        "teacher_status": row["teacher_status"],
        "teacher_institution": row["teacher_institution"],
        "display_name": row["display_name"] or row["name"],
        "streak_days": row["streak_days"] or 0,
        "comeback_points": row["comeback_points"] or 0,
        "privacy_level": row["privacy_level"] or "public"
    }

async def get_current_user(
    authorization: Optional[str] = Header(None),
    x_auth_token: Optional[str] = Header(None)
) -> Dict[str, Any]:
    token = None
    if authorization and authorization.startswith("Bearer "):
        token = authorization[7:].strip()
    elif x_auth_token:
        token = x_auth_token.strip()

    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required. Please log in."
        )

    user = get_user_by_token(token)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Session invalid or expired. Please log in again."
        )

    return user

async def get_optional_user(
    authorization: Optional[str] = Header(None),
    x_auth_token: Optional[str] = Header(None)
) -> Optional[Dict[str, Any]]:
    try:
        return await get_current_user(authorization, x_auth_token)
    except HTTPException:
        return None

async def get_verified_teacher(current_user: Dict[str, Any] = Depends(get_current_user)) -> Dict[str, Any]:
    if current_user["role"] != "teacher" and current_user["role"] != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Educator credentials required."
        )

    if current_user["role"] == "teacher":
        status_val = current_user.get("teacher_status")
        if status_val == "PENDING":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Your teacher account is awaiting verification by an administrator."
            )
        elif status_val == "REJECTED":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Your teacher account verification has been rejected."
            )
        elif status_val == "SUSPENDED":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Your teacher account has been suspended."
            )
        elif status_val != "VERIFIED":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Unverified educator account."
            )

    return current_user

async def get_admin_user(current_user: Dict[str, Any] = Depends(get_current_user)) -> Dict[str, Any]:
    if current_user["role"] != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Administrator authorization required."
        )
    return current_user
