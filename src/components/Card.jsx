import React from 'react';
import theme from '../styles/theme';

export function Card({ title, icon, onClick, children, className = '' }) {
  const isInteractive = typeof onClick === 'function';
  
  return (
    <div 
      onClick={isInteractive ? onClick : undefined}
      className={`
        ${theme.card.base} 
        ${isInteractive ? theme.card.interactive : ''} 
        ${className}
      `}
    >
      {(title || icon) && (
        <div className="flex items-center justify-between px-5 pt-4 pb-1 border-b border-slate-50">
          {title && (
            <h3 className={`${theme.card.title} select-none`}>
              {title}
            </h3>
          )}
          {icon && (
            <div className="text-indigo-500 p-2 rounded-xl bg-indigo-50/50 border border-indigo-100/30">
              {icon}
            </div>
          )}
        </div>
      )}
      <div className="p-5">
        {children}
      </div>
    </div>
  );
}

export default Card;
