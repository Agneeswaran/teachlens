import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCheck, Sparkles, TrendingUp, AlertTriangle, ArrowRight, Clock } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ActiveTab } from '../../types';

export const NotificationsDrawer: React.FC = () => {
  const {
    isNotificationsOpen,
    setIsNotificationsOpen,
    notifications,
    markNotificationAsRead,
    setCurrentTab
  } = useApp();

  const handleActionClick = (actionUrl?: string, id?: string) => {
    if (id) markNotificationAsRead(id);
    if (actionUrl) {
      setCurrentTab(actionUrl as ActiveTab);
      setIsNotificationsOpen(false);
    }
  };

  return (
    <AnimatePresence>
      {isNotificationsOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsNotificationsOpen(false)}
            className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs z-50"
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-50 border-l border-slate-100 flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <span>Diagnostic Alerts</span>
                  <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Real-time adaptive learning recommendations</p>
              </div>
              <button
                onClick={() => setIsNotificationsOpen(false)}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {notifications.map((item) => {
                const getIcon = () => {
                  switch (item.type) {
                    case 'recovery':
                      return <Sparkles className="w-4 h-4 text-blue-600" />;
                    case 'mastery':
                      return <TrendingUp className="w-4 h-4 text-emerald-600" />;
                    case 'assessment':
                      return <AlertTriangle className="w-4 h-4 text-amber-500" />;
                    default:
                      return <Clock className="w-4 h-4 text-slate-500" />;
                  }
                };

                return (
                  <motion.div
                    key={item.id}
                    layout
                    onClick={() => markNotificationAsRead(item.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      item.read
                        ? 'bg-white border-slate-100 text-slate-600'
                        : 'bg-blue-50/40 border-blue-100/80 shadow-xs'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-white border border-slate-100 shadow-xs mt-0.5">
                        {getIcon()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className={`text-sm font-semibold truncate ${item.read ? 'text-slate-800' : 'text-blue-900'}`}>
                            {item.title}
                          </h4>
                          <span className="text-[11px] text-slate-400 whitespace-nowrap">
                            {item.timestamp}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                          {item.message}
                        </p>
                        {item.actionUrl && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleActionClick(item.actionUrl, item.id);
                            }}
                            className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                          >
                            <span>Open {item.actionUrl.toUpperCase()}</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <CheckCheck className="w-4 h-4 text-emerald-600" />
                All adaptive signals synced
              </span>
              <button
                onClick={() => {
                  notifications.forEach((n) => markNotificationAsRead(n.id));
                }}
                className="font-medium text-blue-600 hover:underline"
              >
                Mark all as read
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};
