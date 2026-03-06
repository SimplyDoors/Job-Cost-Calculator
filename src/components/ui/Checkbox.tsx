
import React from 'react';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  description?: string;
  badge?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({ label, description, badge, className = '', ...props }) => {
  return (
    <div className={`relative flex items-start py-3 px-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer ${className}`}>
      <div className="flex h-6 items-center">
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-gray-300 text-brand-500 focus:ring-brand-400"
          {...props}
        />
      </div>
      <div className="ml-3 text-sm leading-6 flex-1">
        <label htmlFor={props.id} className="font-medium text-gray-900 cursor-pointer select-none">
          {label}
        </label>
        {description && <p className="text-gray-500 select-none">{description}</p>}
      </div>
      {badge && (
        <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
          {badge}
        </span>
      )}
    </div>
  );
};
