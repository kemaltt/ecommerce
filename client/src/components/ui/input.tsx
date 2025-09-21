import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onClear?: () => void;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, onClear, value, onChange, ...props }, ref) => {
    const [showClearButton, setShowClearButton] = React.useState(Boolean(value));
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (onChange) {
        onChange(e);
      }
      setShowClearButton(Boolean(e.target.value));
    };

    const handleClear = () => {
      if (onClear) {
        onClear();
      } else if (onChange) {
        // Wenn kein onClear vorhanden ist, setzen wir das Input-Feld zurück
        const event = {
          target: { value: "" }
        } as React.ChangeEvent<HTMLInputElement>;
        onChange(event);
      }
      setShowClearButton(false);
    };

    return (
      <div className="relative w-full">
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus:outline-none focus:ring-0 focus:ring-offset-0 focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            showClearButton ? "pr-8" : "",
            className
          )}
          ref={ref}
          value={value}
          onChange={handleChange}
          {...props}
        />
        {showClearButton && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 h-5 w-5 rounded-full text-muted-foreground hover:text-foreground focus:outline-none focus:ring-0"
            aria-label="Clear input"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
export type { InputProps }
