/**
 * Accessibility Utilities
 * WCAG 2.1 compliance helpers for keyboard navigation, focus management, and ARIA labels
 */

/* eslint-disable react-refresh/only-export-components */
import * as React from 'react';

/**
 * Combine class names with null/undefined filtering
 */
export function classNames(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Generate unique IDs for accessibility purposes
 */
const idMap = new Map<string, number>();

export function generateId(prefix: string): string {
  const count = (idMap.get(prefix) || 0) + 1;
  idMap.set(prefix, count);
  return `${prefix}-${count}`;
}

/**
 * Skip to main content link - typically hidden but appears on Tab key
 */
export const SkipToMain: React.FC = () => (
  <a
    href="#main-content"
    className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-50 focus:p-4 focus:bg-cyan-600 focus:text-white"
  >
    Skip to main content
  </a>
);

/**
 * Screen reader only text - hidden visually but available to screen readers
 */
export function srOnly(): React.CSSProperties {
  return {
    position: 'absolute',
    width: '1px',
    height: '1px',
    padding: '0',
    margin: '-1px',
    overflow: 'hidden',
    clip: 'rect(0, 0, 0, 0)',
    whiteSpace: 'nowrap',
    borderWidth: '0',
  };
}

/**
 * Keyboard event handler for navigation
 */
export function handleKeyboardNavigation(
  event: React.KeyboardEvent,
  {
    onEnter,
    onEscape,
    onArrowUp,
    onArrowDown,
    onArrowLeft,
    onArrowRight,
    onTab,
  }: {
    onEnter?: () => void;
    onEscape?: () => void;
    onArrowUp?: () => void;
    onArrowDown?: () => void;
    onArrowLeft?: () => void;
    onArrowRight?: () => void;
    onTab?: (isShift: boolean) => void;
  },
) {
  switch (event.key) {
    case 'Enter':
    case ' ':
      if (onEnter) {
        event.preventDefault();
        onEnter();
      }
      break;
    case 'Escape':
      if (onEscape) {
        event.preventDefault();
        onEscape();
      }
      break;
    case 'ArrowUp':
      if (onArrowUp) {
        event.preventDefault();
        onArrowUp();
      }
      break;
    case 'ArrowDown':
      if (onArrowDown) {
        event.preventDefault();
        onArrowDown();
      }
      break;
    case 'ArrowLeft':
      if (onArrowLeft) {
        event.preventDefault();
        onArrowLeft();
      }
      break;
    case 'ArrowRight':
      if (onArrowRight) {
        event.preventDefault();
        onArrowRight();
      }
      break;
    case 'Tab':
      if (onTab) {
        onTab(event.shiftKey);
      }
      break;
  }
}

/**
 * Announce to screen readers
 */
export function announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite') {
  const div = document.createElement('div');
  div.setAttribute('role', 'status');
  div.setAttribute('aria-live', priority);
  div.setAttribute('aria-atomic', 'true');
  div.className = 'sr-only';
  div.textContent = message;
  document.body.appendChild(div);

  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(div);
  }, 1000);
}

/**
 * Focus trap for modals - keeps focus within element
 */
export function useFocusTrap(containerRef: React.RefObject<HTMLDivElement>) {
  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    container.addEventListener('keydown', handleKeyDown);
    firstElement?.focus();

    return () => {
      container.removeEventListener('keydown', handleKeyDown);
    };
  }, [containerRef]);
}

/**
 * Announce loading states
 */
export const LoadingAnnouncement: React.FC<{ isLoading: boolean; message?: string }> = ({ isLoading, message = 'Loading' }) => (
  <div
    role="status"
    aria-live="polite"
    aria-busy={isLoading}
    style={srOnly()}
  >
    {isLoading && message}
  </div>
);

/**
 * Create accessible button with proper ARIA attributes
 */
interface AccessibleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  ariaLabel?: string;
  ariaPressed?: boolean;
  ariaHaspopup?: 'menu' | 'listbox' | 'dialog' | 'grid' | 'tree' | false;
}

export const AccessibleButton = React.forwardRef<HTMLButtonElement, AccessibleButtonProps>(
  ({ ariaLabel, ariaPressed, ariaHaspopup, children, ...props }, ref) => (
    <button
      ref={ref}
      aria-label={ariaLabel}
      aria-pressed={ariaPressed}
      aria-haspopup={ariaHaspopup}
      {...props}
    >
      {children}
    </button>
  ),
);

AccessibleButton.displayName = 'AccessibleButton';

/**
 * React hook for focus management
 */
export function useFocusManagement() {
  const previousActiveElement = React.useRef<HTMLElement | null>(null);

  const saveFocus = () => {
    previousActiveElement.current = document.activeElement as HTMLElement;
  };

  const restoreFocus = () => {
    previousActiveElement.current?.focus();
  };

  return { saveFocus, restoreFocus };
}
