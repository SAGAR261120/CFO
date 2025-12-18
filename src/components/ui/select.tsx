import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

// --- Types ---

type SelectContextType = {
  value?: string;
  onValueChange?: (value: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
};

const SelectContext = createContext<SelectContextType | undefined>(undefined);

// --- Components ---

export const Select: React.FC<{
  value?: string;
  onValueChange?: (value: string) => void;
  children?: React.ReactNode;
}> = ({ value, onValueChange, children }) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <SelectContext.Provider value={{ value, onValueChange, open, setOpen }}>
      <div className="relative w-full" ref={containerRef}>
        {children}
      </div>
    </SelectContext.Provider>
  );
};

export const SelectTrigger: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = '',
  ...props
}) => {
  const context = useContext(SelectContext);
  if (!context) throw new Error("SelectTrigger must be used within a Select");

  return (
    <div
      onClick={() => context.setOpen(!context.open)}
      className={`flex h-9 w-full items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm ring-offset-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-950 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer ${className}`}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 opacity-50" />
    </div>
  );
};

export const SelectValue: React.FC<{ placeholder?: string }> = ({ placeholder }) => {
  const context = useContext(SelectContext);
  if (!context) throw new Error("SelectValue must be used within a Select");

  // If there is no value, show placeholder, otherwise show the value text
  // In a real app, you might map the 'value' ID to a 'label' string here.
  // For this snippet, we simply display the value prop or the placeholder.
  return (
    <span className="block truncate">
      {context.value ? context.value.charAt(0).toUpperCase() + context.value.slice(1) : (placeholder || "Select...")}
    </span>
  );
};

export const SelectContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = '',
  ...props
}) => {
  const context = useContext(SelectContext);
  if (!context) throw new Error("SelectContent must be used within a Select");

  if (!context.open) return null;

  return (
    <div
      className={`absolute z-50 top-[calc(100%+4px)] min-w-[8rem] w-full overflow-hidden rounded-md border border-slate-200 bg-white text-slate-950 shadow-md animate-in fade-in-0 zoom-in-95 ${className}`}
      {...props}
    >
      <div className="p-1">{children}</div>
    </div>
  );
};

export const SelectItem: React.FC<{
  value: string;
  children?: React.ReactNode;
  className?: string;
}> = ({ value, children, className = '' }) => {
  const context = useContext(SelectContext);
  if (!context) throw new Error("SelectItem must be used within a Select");

  const isSelected = context.value === value;

  const handleSelect = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (context.onValueChange) {
      context.onValueChange(value);
    }
    context.setOpen(false);
  };

  return (
    <div
      role="option"
      onClick={handleSelect}
      className={`relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-2 pr-2 text-sm outline-none hover:bg-slate-100 hover:text-slate-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 ${
        isSelected ? 'bg-slate-100 font-medium' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};

export default Select;