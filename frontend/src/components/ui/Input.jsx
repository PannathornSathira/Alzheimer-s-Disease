import React from 'react';

export function Input({ label, id, error, className = '', ...props }) {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-text-main mb-1.5">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`w-full px-4 py-2.5 bg-white border rounded-md shadow-sm 
          focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors
          ${error ? 'border-danger focus:ring-danger focus:border-danger' : 'border-slate-300'}
          disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none
        `}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-danger font-medium">{error}</p>
      )}
    </div>
  );
}
