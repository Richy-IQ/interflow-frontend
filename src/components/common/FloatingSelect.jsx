import React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * FloatingSelect – select with a floating label.
 * Props: label, options[{value,label}], error, className, ...rest
 */
const FloatingSelect = React.forwardRef(
  ({ label, options = [], error, className, ...rest }, ref) => {
    const hasValue = !!rest.value;

    return (
      <div className={cn('relative w-full', className)}>
        <div
          className={cn(
            'relative border rounded-lg transition-all duration-150',
            error
              ? 'border-red-400'
              : 'border-[#E0E0E0] focus-within:border-[#8B6914]',
          )}
        >
          <select
            ref={ref}
            className="peer w-full px-4 pt-6 pb-2 pr-10 text-[15px] text-[#1A1A1A] bg-transparent outline-none rounded-lg appearance-none cursor-pointer"
            {...rest}
          >
            <option value="" disabled hidden />
            {options.map(o => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>

          <label
            className={cn(
              'absolute left-4 transition-all duration-150 pointer-events-none text-[#AAAAAA]',
              'peer-focus:top-1.5 peer-focus:text-[11px] peer-focus:text-[#8B6914]',
              hasValue ? 'top-1.5 text-[11px]' : 'top-4 text-[15px]',
            )}
          >
            {label}
          </label>

          <ChevronDown
            size={16}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#AAAAAA] pointer-events-none"
          />
        </div>
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </div>
    );
  },
);
FloatingSelect.displayName = 'FloatingSelect';

export default FloatingSelect;
