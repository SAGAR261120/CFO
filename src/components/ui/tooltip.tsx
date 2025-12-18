import React, { createContext, useContext, useState } from 'react';

// --- Types ---

type TooltipContextType = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const TooltipContext = createContext<TooltipContextType | undefined>(undefined);

// --- Components ---

/**
 * TooltipProvider
 * In standard libraries (Radix), this holds global config. 
 * Here it acts as a pass-through to satisfy the dashboard structure.
 */
export const TooltipProvider: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <>{children}</>
);

/**
 * Tooltip
 * Manages the open/close state.
 */
export const Tooltip: React.FC<{ children?: React.ReactNode; delayDuration?: number }> = ({ 
  children, 
  delayDuration = 200 
}) => {
  const [open, setOpen] = useState(false);

  return (
    <TooltipContext.Provider value={{ open, setOpen }}>
      <div className="relative inline-block">
        {children}
      </div>
    </TooltipContext.Provider>
  );
};

/**
 * TooltipTrigger
 * Handles hover events to show/hide the tooltip.
 */
export const TooltipTrigger: React.FC<React.HTMLAttributes<HTMLDivElement> & { asChild?: boolean }> = ({ 
  children, 
  className = '', 
  asChild = false, // In this simple implementation, we just wrap.
  ...props 
}) => {
  const context = useContext(TooltipContext);
  if (!context) throw new Error("TooltipTrigger must be used within a Tooltip");

  return (
    <div
      className={`inline-block ${className}`}
      onMouseEnter={() => context.setOpen(true)}
      onMouseLeave={() => context.setOpen(false)}
      onFocus={() => context.setOpen(true)}
      onBlur={() => context.setOpen(false)}
      {...props}
    >
      {children}
    </div>
  );
};

/**
 * TooltipContent
 * The floating content that appears when hovered.
 */
export const TooltipContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ 
  children, 
  className = '', 
  ...props 
}) => {
  const context = useContext(TooltipContext);
  if (!context) throw new Error("TooltipContent must be used within a Tooltip");

  if (!context.open) return null;

  return (
    <div
      className={`absolute z-50 px-3 py-1.5 text-xs font-medium text-white bg-slate-900 rounded-md shadow-md animate-in fade-in-0 zoom-in-95 bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2 mb-1 whitespace-nowrap ${className}`}
      {...props}
    >
      {children}
      {/* Tiny arrow pointing down */}
      <div 
        className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900" 
      />
    </div>
  );
};

export default Tooltip;