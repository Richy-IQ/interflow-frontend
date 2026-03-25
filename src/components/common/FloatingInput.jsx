import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * FloatingInput – input with a floating label (shrinks up on focus/fill).
 * Props: label, type, error, className, ...rest (passed to <input>)
 */
const FloatingInput = React.forwardRef(
  ({ label, type = 'text', error, className, ...rest }, ref) => {
    const [show, setShow] = useState(false);
    const isPassword = type === 'password';
    const inputType  = isPassword ? (show ? 'text' : 'password') : type;
    const hasValue   = !!rest.value;

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
          <input
            ref={ref}
            type={inputType}
            placeholder=" "
            className="peer w-full px-4 pt-6 pb-2 text-[15px] text-[#1A1A1A] bg-transparent outline-none rounded-lg"
            {...rest}
          />
          <label
            className={cn(
              'absolute left-4 transition-all duration-150 pointer-events-none',
              'text-[#AAAAAA]',
              'peer-placeholder-shown:top-4 peer-placeholder-shown:text-[15px]',
              'peer-focus:top-1.5 peer-focus:text-[11px] peer-focus:text-[#8B6914]',
              hasValue ? 'top-1.5 text-[11px]' : '',
            )}
          >
            {label}
          </label>

          {isPassword && (
            <button
              type="button"
              onClick={() => setShow(s => !s)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#AAAAAA] hover:text-[#555]"
              tabIndex={-1}
            >
              {show ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
          )}
        </div>
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </div>
    );
  },
);
FloatingInput.displayName = 'FloatingInput';

export default FloatingInput;
