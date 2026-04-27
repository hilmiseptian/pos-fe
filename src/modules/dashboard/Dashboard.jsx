import { useState, useEffect } from 'react';
import {
  Tag,
  Layers,
  GitBranch,
  Package,
  ShieldCheck,
  Users,
  TrendingUp,
  Activity,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const defaultStats = {
  categories: 12,
  subcategories: 34,
  branches: 5,
  items: 128,
  roles: 6,
  users: 47,
};

const cards = [
  {
    key: 'categories',
    title: 'Categories',
    icon: Tag,
    route: '/categories',
    color: 'from-violet-500 to-purple-600',
    bg: 'bg-violet-50',
    text: 'text-violet-600',
    border: 'border-violet-100',
    ring: 'ring-violet-200',
  },
  {
    key: 'subcategories',
    title: 'Subcategories',
    icon: Layers,
    route: '/sub-categories',
    color: 'from-blue-500 to-cyan-500',
    bg: 'bg-blue-50',
    text: 'text-blue-600',
    border: 'border-blue-100',
    ring: 'ring-blue-200',
  },
  {
    key: 'branches',
    title: 'Branches',
    icon: GitBranch,
    route: '/branches',
    color: 'from-emerald-500 to-teal-500',
    bg: 'bg-emerald-50',
    text: 'text-emerald-600',
    border: 'border-emerald-100',
    ring: 'ring-emerald-200',
  },
  {
    key: 'items',
    title: 'Items',
    icon: Package,
    route: '/items',
    color: 'from-orange-400 to-amber-500',
    bg: 'bg-orange-50',
    text: 'text-orange-600',
    border: 'border-orange-100',
    ring: 'ring-orange-200',
  },
  {
    key: 'roles',
    title: 'Roles',
    icon: ShieldCheck,
    route: '/roles',
    color: 'from-rose-500 to-pink-500',
    bg: 'bg-rose-50',
    text: 'text-rose-600',
    border: 'border-rose-100',
    ring: 'ring-rose-200',
  },
  {
    key: 'users',
    title: 'Users',
    icon: Users,
    route: '/users',
    color: 'from-indigo-500 to-blue-600',
    bg: 'bg-indigo-50',
    text: 'text-indigo-600',
    border: 'border-indigo-100',
    ring: 'ring-indigo-200',
  },
];

function AnimatedCount({ target, duration = 1200 }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);

  return <span>{count}</span>;
}

export default function Dashboard({ stats = defaultStats }) {
  const navigate = useNavigate();
  const total = Object.values(stats).reduce((a, b) => a + b, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-6 lg:p-10 font-sans">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center shadow">
            <Activity size={18} className="text-white" />
          </div>
          <span className="text-xs font-semibold tracking-widest text-slate-400 uppercase">
            Master Data Overview
          </span>
        </div>
        <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-800 tracking-tight">
          Dashboard
        </h1>
        <p className="text-slate-400 mt-1 text-sm">
          Summary of all master data entities in your company system.
        </p>
      </div>

      {/* Summary Banner */}
      {/* <div className="mb-8 rounded-2xl bg-gradient-to-r from-slate-800 to-slate-700 p-6 flex items-center justify-between shadow-lg shadow-slate-200 gap-6 flex-wrap">
        <div>
          <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-1">
            Total Records
          </p>
          <p className="text-white text-5xl font-black leading-none">
            <AnimatedCount target={total} />
          </p>
          <p className="text-slate-400 text-xs mt-2">
            Across {cards.length} master data categories
          </p>
        </div>
        <div className="flex gap-3 flex-wrap">
          {cards.map((c) => {
            const Icon = c.icon;
            const pct = Math.round((stats[c.key] / total) * 100);
            return (
              <div
                key={c.key}
                className="flex items-center gap-2 bg-white/10 rounded-xl px-3 py-2">
                <Icon size={14} className="text-white/60" />
                <div>
                  <p className="text-white text-xs font-bold leading-none">
                    {stats[c.key]}
                  </p>
                  <p className="text-slate-400 text-[10px]">{pct}%</p>
                </div>
              </div>
            );
          })}
        </div>
      </div> */}

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {cards.map((card, i) => {
          const Icon = card.icon;
          const value = stats[card.key] ?? 0;
          const pct = Math.round((value / total) * 100);

          return (
            <div
              key={card.key}
              onClick={() => navigate(card.route)}
              className={`group relative bg-white rounded-2xl border ${card.border} shadow-sm 
      hover:shadow-xl hover:-translate-y-1 cursor-pointer transition-all duration-300 overflow-hidden`}
              style={{ animationDelay: `${i * 80}ms` }}>
              {/* Top gradient bar */}
              <div className={`h-1 w-full bg-gradient-to-r ${card.color}`} />

              <div className="p-6">
                <div className="flex items-start justify-between mb-5">
                  {/* Icon */}
                  <div
                    className={`w-12 h-12 rounded-2xl ${card.bg} flex items-center justify-center shadow-sm ring-1 ${card.ring} group-hover:scale-110 transition-transform duration-300`}>
                    <Icon size={22} className={card.text} strokeWidth={1.8} />
                  </div>

                  {/* Percentage badge */}
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full ${card.bg} ${card.text}`}>
                    {pct}%
                  </span>
                </div>

                {/* Count */}
                <p className="text-4xl font-black text-slate-800 leading-none mb-1 tabular-nums">
                  <AnimatedCount target={value} duration={900 + i * 100} />
                </p>

                {/* Title */}
                <p className="text-slate-500 text-sm font-medium">
                  {card.title}
                </p>

                {/* Progress bar */}
                <div className="mt-4 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${card.color} rounded-full transition-all duration-700`}
                    style={{ width: `${pct}%` }}
                  />
                </div>

                {/* Bottom link */}
                <div className="mt-4 flex items-center gap-1">
                  <TrendingUp size={12} className={`${card.text} opacity-60`} />
                  <span
                    className={`text-xs ${card.text} font-medium opacity-70`}>
                    {value} total {card.title.toLowerCase()}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <p className="text-center text-slate-300 text-xs mt-10">
        Last updated · just now
      </p>
    </div>
  );
}
