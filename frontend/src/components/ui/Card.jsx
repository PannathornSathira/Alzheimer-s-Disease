import React from 'react';

export function Card({ children, className = '', onClick, selectable = false, selected = false, disabled = false }) {
  const baseStyle = "bg-white rounded-xl shadow-sm border overflow-hidden transition-all duration-200";
  const hoverStyle = selectable && !disabled ? "cursor-pointer hover:shadow-md hover:border-blue-300" : "";
  const selectedStyle = selected ? "border-primary ring-1 ring-primary bg-primary-light/10" : "border-slate-200";
  const disabledStyle = disabled ? "opacity-60 cursor-not-allowed bg-slate-50" : "";

  return (
    <div 
      className={`${baseStyle} ${hoverStyle} ${selectedStyle} ${disabledStyle} ${className}`}
      onClick={!disabled && selectable ? onClick : undefined}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }) {
  return (
    <div className={`px-6 py-5 border-b border-slate-100 ${className}`}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = '' }) {
  return (
    <h3 className={`text-xl font-semibold text-text-main leading-none tracking-tight ${className}`}>
      {children}
    </h3>
  );
}

export function CardContent({ children, className = '' }) {
  return (
    <div className={`p-6 ${className}`}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className = '' }) {
  return (
    <div className={`px-6 py-4 bg-background-alt border-t border-slate-100 flex items-center ${className}`}>
      {children}
    </div>
  );
}
