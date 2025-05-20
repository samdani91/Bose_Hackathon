import React from 'react';
import { Home, Globe, Tag, Users, BookOpen, MessageSquare, Award } from 'lucide-react';
import { Link } from '../ui/Link';

export const SidebarNav: React.FC = () => {
  const navItems = [
    { icon: <Home className="h-5 w-5" />, label: 'Home', href: '/' },
    { icon: <Globe className="h-5 w-5" />, label: 'All Questions', href: '/questions' },
    { icon: <Tag className="h-5 w-5" />, label: 'Tags', href: '/tags' },
    { icon: <Users className="h-5 w-5" />, label: 'Users', href: '/users' },
    { icon: <Award className="h-5 w-5" />, label: 'Badges', href: '/badges' },
    { icon: <BookOpen className="h-5 w-5" />, label: 'Help', href: '/help' },
  ];

  return (
    <nav className="space-y-1">
      {navItems.map((item, index) => (
        <Link
          key={index}
          href={item.href}
          className="group flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
        >
          <span className="text-slate-500 group-hover:text-indigo-500 mr-3 transition-colors">
            {item.icon}
          </span>
          {item.label}
        </Link>
      ))}
    </nav>
  );
};