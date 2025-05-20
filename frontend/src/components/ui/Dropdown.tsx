import React, { useEffect, useRef, useState, cloneElement, isValidElement } from 'react';

interface DropdownProps {
  trigger: React.ReactNode;
  children: React.ReactNode | ((close: () => void) => React.ReactNode);
  align?: 'left' | 'right';
  className?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  children,
  align = 'right',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setIsOpen(!isOpen);
  const closeDropdown = () => setIsOpen(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const alignmentClasses = align === 'right' ? 'right-0' : 'left-0';

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div onClick={toggleDropdown}>
        {isValidElement(trigger) ? cloneElement(trigger as React.ReactElement) : trigger}
      </div>
      {isOpen && (
        <div
          className={`absolute ${alignmentClasses} z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-md focus:outline-none transform transition-all duration-100 animate-dropdown-in`}
        >
          {typeof children === 'function' ? children(closeDropdown) : children}
        </div>
      )}
    </div>
  );
};

export const DropdownItem: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  isDanger?: boolean;
}> = ({ children, onClick, className = '', isDanger = false }) => {
  const baseClasses = 'block w-full text-left px-4 py-2 text-sm';
  const colorClasses = isDanger
    ? 'text-red-600 hover:bg-red-50'
    : 'text-slate-700 hover:bg-slate-50';

  return (
    <button
      className={`${baseClasses} ${colorClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
