import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Network,
  AlertTriangle,
  CheckCircle2,
  Lock,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Info,
  Layers
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface GraphNode {
  id: string;
  name: string;
  category: string;
  score: number;
  status: 'mastered' | 'needs_practice' | 'critical_gap' | 'locked';
  x: number;
  y: number;
  prerequisites: string[];
  dependents: string[];
  mistakes: string[];
  recommendation: string;
}

export const PrerequisiteGraph: React.FC = () => {
  const { setCurrentTab, activePrereqConcept, setActivePrereqConcept } = useApp();

  const [selectedNodeId, setSelectedNodeId] = useState<string>(
    activePrereqConcept || 'differentiation'
  );

  const nodes: GraphNode[] = [
    {
      id: 'algebra',
      name: 'Algebra Foundations',
      category: 'Foundations',
      score: 94,
      status: 'mastered',
      x: 100,
      y: 200,
      prerequisites: [],
      dependents: ['functions', 'limits'],
      mistakes: ['Occasional sign error on binomial multiplication'],
      recommendation: 'Solid foundational mastery. Maintain through periodic spaced review.'
    },
    {
      id: 'functions',
      name: 'Functions & Graphs',
      category: 'Foundations',
      score: 88,
      status: 'mastered',
      x: 300,
      y: 120,
      prerequisites: ['algebra'],
      dependents: ['limits'],
      mistakes: ['Inverse composition domain edge cases'],
      recommendation: 'High comprehension of function mappings and transformations.'
    },
    {
      id: 'limits',
      name: 'Limits & Continuity',
      category: 'Calculus',
      score: 64,
      status: 'needs_practice',
      x: 520,
      y: 120,
      prerequisites: ['functions', 'algebra'],
      dependents: ['differentiation'],
      mistakes: ['One-sided boundary values vs function evaluation'],
      recommendation: 'Targeted visual discontinuity review recommended to strengthen secant intuition.'
    },
    {
      id: 'differentiation',
      name: 'Differentiation',
      category: 'Calculus',
      score: 32,
      status: 'critical_gap',
      x: 740,
      y: 200,
      prerequisites: ['limits', 'functions', 'algebra'],
      dependents: ['integration'],
      mistakes: [
        'Power rule: omitting exponent reduction n - 1',
        'Negative exponent sign flip in rational derivatives',
        'Conflating polynomial power rule with exponential derivatives'
      ],
      recommendation: 'CRITICAL INTERVENTION: 15-minute Power Rule & Exponent Dynamics recovery plan ready.'
    },
    {
      id: 'integration',
      name: 'Integration',
      category: 'Calculus',
      score: 18,
      status: 'locked',
      x: 940,
      y: 200,
      prerequisites: ['differentiation'],
      dependents: [],
      mistakes: ['Anti-derivative concept blocked by derivative gap'],
      recommendation: 'Locked until Differentiation reaches at least 70% verified mastery.'
    }
  ];

  const connections = [
    { from: 'algebra', to: 'functions' },
    { from: 'algebra', to: 'limits' },
    { from: 'functions', to: 'limits' },
    { from: 'limits', to: 'differentiation' },
    { from: 'differentiation', to: 'integration' }
  ];

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || nodes[3];

  const getNodeStyles = (status: GraphNode['status']) => {
    switch (status) {
      case 'mastered':
        return {
          fill: '#ECFDF5',
          stroke: '#10B981',
          text: 'text-emerald-700',
          badge: 'bg-emerald-50 text-emerald-700 border-emerald-200'
        };
      case 'needs_practice':
        return {
          fill: '#FFFBEB',
          stroke: '#F59E0B',
          text: 'text-amber-700',
          badge: 'bg-amber-50 text-amber-700 border-amber-200'
        };
      case 'critical_gap':
        return {
          fill: '#FEF2F2',
          stroke: '#EF4444',
          text: 'text-rose-700',
          badge: 'bg-rose-50 text-rose-700 border-rose-200'
        };
      case 'locked':
        return {
          fill: '#F8FAFC',
          stroke: '#94A3B8',
          text: 'text-slate-500',
          badge: 'bg-slate-100 text-slate-600 border-slate-200'
        };
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
              Dependency Topology
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-slate-500">Knowledge Graph v2.4</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Prerequisite Concept Graph
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Visualizing prerequisite chains: see why gaps in earlier concepts block advanced topics.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 p-2 bg-slate-50 rounded-2xl border border-slate-200/60 text-xs font-semibold">
          <div className="flex items-center gap-1.5 text-emerald-700">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>Mastered</span>
          </div>
          <div className="flex items-center gap-1.5 text-amber-700">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>Needs Practice</span>
          </div>
          <div className="flex items-center gap-1.5 text-rose-700">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
            <span>Critical Gap</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-500">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
            <span>Locked</span>
          </div>
        </div>
      </div>

      {/* Main Interactive Topology Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Interactive SVG Diagram Canvas */}
        <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs relative overflow-hidden">
          
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" />
              Interactive Prerequisite Flow (Click nodes to inspect)
            </span>
            <span className="text-xs text-blue-600 font-semibold">
              Differentiation is highlighted
            </span>
          </div>

          {/* SVG Canvas Container */}
          <div className="w-full overflow-x-auto pb-4">
            <svg
              viewBox="0 0 1050 360"
              className="w-full min-w-[750px] h-[340px] select-none"
            >
              <defs>
                <marker
                  id="arrow-default"
                  viewBox="0 0 10 10"
                  refX="18"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#94A3B8" />
                </marker>
                <marker
                  id="arrow-active"
                  viewBox="0 0 10 10"
                  refX="18"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#2563EB" />
                </marker>
              </defs>

              {/* Connecting Lines */}
              {connections.map((conn, idx) => {
                const source = nodes.find((n) => n.id === conn.from)!;
                const target = nodes.find((n) => n.id === conn.to)!;
                const isConnectedToSelected =
                  conn.from === selectedNodeId || conn.to === selectedNodeId;

                return (
                  <g key={idx}>
                    <line
                      x1={source.x}
                      y1={source.y}
                      x2={target.x}
                      y2={target.y}
                      stroke={isConnectedToSelected ? '#2563EB' : '#CBD5E1'}
                      strokeWidth={isConnectedToSelected ? 2.5 : 1.5}
                      strokeDasharray={isConnectedToSelected ? '4 2' : 'none'}
                      markerEnd={isConnectedToSelected ? 'url(#arrow-active)' : 'url(#arrow-default)'}
                      className="transition-all duration-300"
                    />
                  </g>
                );
              })}

              {/* Interactive Nodes */}
              {nodes.map((node) => {
                const isSelected = selectedNodeId === node.id;
                const isCritical = node.status === 'critical_gap';
                const style = getNodeStyles(node.status);

                return (
                  <g
                    key={node.id}
                    onClick={() => {
                      setSelectedNodeId(node.id);
                      setActivePrereqConcept(node.id);
                    }}
                    className="cursor-pointer group"
                    transform={`translate(${node.x}, ${node.y})`}
                  >
                    {/* Pulsing ring for critical gap */}
                    {isCritical && (
                      <circle
                        r="48"
                        fill="none"
                        stroke="#EF4444"
                        strokeWidth="2"
                        className="animate-ping opacity-40"
                      />
                    )}

                    {/* Outer selection ring */}
                    {isSelected && (
                      <circle
                        r="45"
                        fill="none"
                        stroke="#2563EB"
                        strokeWidth="3"
                        strokeDasharray="5 3"
                      />
                    )}

                    {/* Main Node Circle */}
                    <circle
                      r="36"
                      fill={style.fill}
                      stroke={style.stroke}
                      strokeWidth={isSelected ? 3 : 2}
                      className="transition-transform duration-200 group-hover:scale-105"
                    />

                    {/* Mastery score in center */}
                    <text
                      textAnchor="middle"
                      dy="5"
                      fontSize="14"
                      fontWeight="bold"
                      fill={node.status === 'locked' ? '#94A3B8' : '#0F172A'}
                    >
                      {node.status === 'locked' ? '🔒' : `${node.score}%`}
                    </text>

                    {/* Node label below circle */}
                    <text
                      textAnchor="middle"
                      dy="54"
                      fontSize="12"
                      fontWeight="bold"
                      fill="#1E293B"
                      className="group-hover:fill-blue-600 transition-colors"
                    >
                      {node.name}
                    </text>
                    <text
                      textAnchor="middle"
                      dy="68"
                      fontSize="10"
                      fill="#64748B"
                    >
                      {node.category}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-blue-600" />
              Differentiation is weak (32%) &rarr; Integration (18%) is actively locked.
            </span>
            <span className="font-semibold text-blue-600">
              Recover Differentiation to unlock Integration
            </span>
          </div>

        </div>

        {/* Selected Node Details Drawer Card */}
        <div className="lg:col-span-4 bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-sm space-y-5">
          
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Concept Inspector
            </span>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getNodeStyles(selectedNode.status).badge}`}>
              {selectedNode.status.replace('_', ' ').toUpperCase()}
            </span>
          </div>

          <div>
            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
              {selectedNode.name}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">{selectedNode.category}</p>
          </div>

          {/* Mastery Score Progress */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="flex items-baseline justify-between mb-1.5">
              <span className="text-xs font-semibold text-slate-600">Assessed Mastery</span>
              <span className="text-2xl font-black text-slate-900">{selectedNode.score}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  selectedNode.status === 'mastered'
                    ? 'bg-emerald-500'
                    : selectedNode.status === 'needs_practice'
                    ? 'bg-amber-500'
                    : selectedNode.status === 'critical_gap'
                    ? 'bg-rose-500'
                    : 'bg-slate-400'
                }`}
                style={{ width: `${selectedNode.score}%` }}
              />
            </div>
          </div>

          {/* Related Prerequisites & Dependents */}
          <div className="space-y-3 text-xs">
            <div>
              <span className="font-bold text-slate-700 block mb-1">Direct Prerequisites:</span>
              <div className="flex flex-wrap gap-1.5">
                {selectedNode.prerequisites.length > 0 ? (
                  selectedNode.prerequisites.map((p) => (
                    <span
                      key={p}
                      onClick={() => setSelectedNodeId(p)}
                      className="px-2 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-200 cursor-pointer hover:bg-blue-100 font-semibold transition-colors"
                    >
                      {p.toUpperCase()}
                    </span>
                  ))
                ) : (
                  <span className="text-slate-400">None (Foundational root)</span>
                )}
              </div>
            </div>

            <div>
              <span className="font-bold text-slate-700 block mb-1">Downstream Topics:</span>
              <div className="flex flex-wrap gap-1.5">
                {selectedNode.dependents.length > 0 ? (
                  selectedNode.dependents.map((d) => (
                    <span
                      key={d}
                      onClick={() => setSelectedNodeId(d)}
                      className="px-2 py-1 rounded-md bg-slate-100 text-slate-700 border border-slate-200 cursor-pointer hover:bg-slate-200 font-medium transition-colors"
                    >
                      {d.toUpperCase()}
                    </span>
                  ))
                ) : (
                  <span className="text-slate-400">Advanced terminal topic</span>
                )}
              </div>
            </div>
          </div>

          {/* Known Mistakes */}
          <div className="pt-2">
            <span className="text-xs font-bold text-slate-700 block mb-1.5">
              Identified Mistakes for this Topic:
            </span>
            <ul className="space-y-1.5">
              {selectedNode.mistakes.map((m, i) => (
                <li key={i} className="text-xs text-slate-600 flex items-start gap-1.5 leading-relaxed">
                  <span className="text-rose-500 font-bold">•</span>
                  <span>{m}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Recommendation */}
          <div className="p-3.5 rounded-2xl bg-blue-50/60 border border-blue-100 text-xs text-blue-900 leading-relaxed font-medium">
            <span className="font-bold block mb-0.5">Recommended Path:</span>
            {selectedNode.recommendation}
          </div>

          {/* Primary Action Button */}
          {selectedNode.id === 'differentiation' ? (
            <button
              onClick={() => setCurrentTab('recovery')}
              className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Launch Differentiation Recovery</span>
            </button>
          ) : (
            <button
              onClick={() => setCurrentTab('quiz')}
              className="w-full py-3 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 text-slate-700 font-bold text-xs shadow-xs hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Practice {selectedNode.name}</span>
            </button>
          )}

        </div>

      </div>

    </div>
  );
};
