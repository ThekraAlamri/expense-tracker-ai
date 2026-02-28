import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { Category } from '@/lib/types';
import { CATEGORY_COLORS } from '@/lib/categories';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  category: Category;
}

export function CategoryBadge({ category, className, ...props }: BadgeProps) {
  const color = CATEGORY_COLORS[category];
  return (
    <span
      className={cn('inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium', className)}
      style={{ backgroundColor: `${color}18`, color }}
      {...props}
    >
      {category}
    </span>
  );
}
