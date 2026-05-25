import React from 'react';

export function Badge({ children, variant = 'default', className = '' }) {
  const baseStyle = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium uppercase tracking-wider";
  
  const variants = {
    default: "bg-slate-100 text-slate-800",
    primary: "bg-primary-light text-primary",
    success: "bg-success-bg text-success",
    warning: "bg-warning-bg text-warning",
    danger: "bg-danger-bg text-danger",
    info: "bg-info-bg text-info",
  };

  return (
    <span className={`${baseStyle} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
