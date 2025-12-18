import React from 'react';

// TABLE WRAPPER + TABLE
export const Table: React.FC<
  React.TableHTMLAttributes<HTMLTableElement>
> = ({ children, className = '', ...props }) => (
  <div className="relative w-full overflow-auto">
    <table
      className={`w-full caption-bottom text-sm ${className}`}
      {...props}
    >
      {children}
    </table>
  </div>
);

// THEAD
export const TableHeader: React.FC<
  React.HTMLAttributes<HTMLTableSectionElement>
> = ({ children, className = '', ...props }) => (
  <thead className={`[&_tr]:border-b ${className}`} {...props}>
    {children}
  </thead>
);

// TBODY
export const TableBody: React.FC<
  React.HTMLAttributes<HTMLTableSectionElement>
> = ({ children, className = '', ...props }) => (
  <tbody
    className={`[&_tr:last-child]:border-0 ${className}`}
    {...props}
  >
    {children}
  </tbody>
);

// TR
export const TableRow: React.FC<
  React.HTMLAttributes<HTMLTableRowElement>
> = ({ children, className = '', ...props }) => (
  <tr
    className={`border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted ${className}`}
    {...props}
  >
    {children}
  </tr>
);

// TH
export const TableHead: React.FC<
  React.ThHTMLAttributes<HTMLTableCellElement>
> = ({ children, className = '', ...props }) => (
  <th
    className={`h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 ${className}`}
    {...props}
  >
    {children}
  </th>
);

// TD
export const TableCell: React.FC<
  React.TdHTMLAttributes<HTMLTableCellElement>
> = ({ children, className = '', ...props }) => (
  <td
    className={`p-2 align-middle [&:has([role=checkbox])]:pr-0 ${className}`}
    {...props}
  >
    {children}
  </td>
);

export default Table;
