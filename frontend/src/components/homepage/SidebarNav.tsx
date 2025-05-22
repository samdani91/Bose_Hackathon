import React from 'react';
import { Home, Globe, Tag, Users, BookOpen, MessageSquare, Award, Brain, BrainCircuit, Sparkles } from 'lucide-react';
import { Link } from '../ui/Link';

export const SidebarNav: React.FC = () => {
  const navItems = [
    { icon: <Home className="h-5 w-5" />, label: 'Home', href: '/' },
    { icon: <Globe className="h-5 w-5" />, label: 'All Questions', href: '/allQuestions' },
    { 
      icon: <BrainCircuit className="h-5 w-5" />, // Changed to Brain icon for brainstorming
      label: 'Quizzes', 
      href: '/quizzes',
      highlight: false // Special flag for highlighting
    },
    { icon: <Tag className="h-5 w-5" />, label: 'Tags', href: '/tags' },
    { icon: <Users className="h-5 w-5" />, label: 'Users', href: '/allUsers' },
    { icon: <Award className="h-5 w-5" />, label: 'Badges', href: '/badges' },
    { icon: <BookOpen className="h-5 w-5" />, label: 'Help', href: '/help' },
  ];

  return (
    <nav className="space-y-1">
      {navItems.map((item, index) => (
        <Link
          key={index}
          to={item.href}
          className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
            item.highlight 
              ? 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100' 
              : 'hover:bg-indigo-50 hover:text-indigo-600'
          }`}
        >
          <span className={`mr-3 transition-colors ${
            item.highlight ? 'text-indigo-500' : 'text-slate-500 group-hover:text-indigo-500'
          }`}>
            {item.icon}
          </span>
          {item.label}
        </Link>
      ))}
    </nav>
  );
};