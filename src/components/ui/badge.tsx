import React from 'react';

// 1. Define the props to include "outline"
interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline";
}

export const Badge = ({ className = "", variant = "default", ...props }: BadgeProps) => {
  // 2. Define styles for each variant
  const variants = {
    default: "border-transparent bg-slate-900 text-white hover:bg-slate-900/80",
    secondary: "border-transparent bg-slate-100 text-slate-900 hover:bg-slate-100/80",
    destructive: "border-transparent bg-red-500 text-white hover:bg-red-500/80",
    outline: "text-slate-950 border-slate-200", // <-- This fixes the error
  };

  const variantStyles = variants[variant] || variants.default;

  return (
    <div 
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 ${variantStyles} ${className}`} 
      {...props} 
    />
  );
};