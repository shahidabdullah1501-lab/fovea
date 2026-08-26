import React from 'react';
import { ViewType } from '../types';
import { Home, BookOpen, Target, BarChart2, User } from 'lucide-react';

interface SidebarProps {
  currentView: ViewType;
  onNavigate: (view: ViewType) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate }) => {
  const items: { id: ViewType; label: string; icon: React.ElementType }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'read', label: 'Read', icon: BookOpen },
    { id: 'train', label: 'Train', icon: Target },
    { id: 'progress', label: 'Progress', icon: BarChart2 },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="hidden lg:flex flex-col fixed top-0 left-0 bottom-0 w-[216px] bg-panel border-r border-line p-6 gap-1 z-30">
      <div className="font-serif italic text-3xl text-brass px-3 pb-6">
        Fovea
      </div>
      {items.map(item => {
        const Icon = item.icon;
        const active = currentView === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`flex items-center gap-3 px-3 py-3 rounded-lg font-semibold text-sm transition-colors text-left ${
              active ? 'text-brass bg-brass-soft' : 'text-text-faint hover:text-text hover:bg-panel-2'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
