// Design Tokens for TRUSTLAYERLABS Cyber Awareness Platform
// Import this file wherever you need consistent design values

export const designTokens = {
    // Color Palette
    colors: {
      // Primary Brand Colors
      primary: {
        cyan: {
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee', // Primary cyan
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
        },
        emerald: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399', // Primary emerald
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
      },
  
      // Severity Colors
      severity: {
        critical: {
          bg: 'from-red-500/20 to-rose-500/20',
          border: 'border-red-500/40',
          text: 'text-red-400',
          glow: 'shadow-red-500/20',
          solid: '#ef4444',
        },
        high: {
          bg: 'from-orange-500/20 to-amber-500/20',
          border: 'border-orange-500/40',
          text: 'text-orange-400',
          glow: 'shadow-orange-500/20',
          solid: '#f97316',
        },
        medium: {
          bg: 'from-yellow-500/20 to-amber-500/20',
          border: 'border-yellow-500/40',
          text: 'text-yellow-400',
          glow: 'shadow-yellow-500/20',
          solid: '#eab308',
        },
        low: {
          bg: 'from-blue-500/20 to-cyan-500/20',
          border: 'border-blue-500/40',
          text: 'text-blue-400',
          glow: 'shadow-blue-500/20',
          solid: '#3b82f6',
        },
        safe: {
          bg: 'from-green-500/20 to-emerald-500/20',
          border: 'border-green-500/40',
          text: 'text-green-400',
          glow: 'shadow-green-500/20',
          solid: '#22c55e',
        },
      },
  
      // Neutral Colors
      neutral: {
        950: '#0f172a', // slate-950 - main bg
        900: '#1e293b', // slate-900 - card bg
        800: '#334155', // slate-800
        700: '#475569', // slate-700
        600: '#64748b', // slate-600
        500: '#94a3b8', // slate-500
        400: '#cbd5e1', // slate-400
        300: '#e2e8f0', // slate-300
        200: '#f1f5f9', // slate-200
        100: '#f8fafc', // slate-100
      },
    },
  
    // Gradients
    gradients: {
      primary: 'bg-gradient-to-r from-cyan-400 via-emerald-400 to-cyan-400',
      primaryReverse: 'bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400',
      card: 'bg-gradient-to-br from-cyan-500/20 to-emerald-500/20',
      button: 'bg-gradient-to-r from-cyan-500 to-emerald-500',
      buttonHover: 'bg-gradient-to-r from-emerald-500 to-cyan-500',
      cyber: 'bg-gradient-to-br from-cyan-500/10 via-transparent to-emerald-500/10',
      danger: 'bg-gradient-to-r from-red-500 to-rose-500',
      warning: 'bg-gradient-to-r from-orange-500 to-amber-500',
    },
  
    // Spacing (Tailwind compatible)
    spacing: {
      xs: '0.5rem',    // 8px
      sm: '0.75rem',   // 12px
      md: '1rem',      // 16px
      lg: '1.5rem',    // 24px
      xl: '2rem',      // 32px
      '2xl': '3rem',   // 48px
      '3xl': '4rem',   // 64px
      '4xl': '6rem',   // 96px
    },
  
    // Border Radius
    radius: {
      sm: '0.375rem',   // 6px
      md: '0.5rem',     // 8px
      lg: '0.75rem',    // 12px
      xl: '1rem',       // 16px
      '2xl': '1.5rem',  // 24px
      full: '9999px',
    },
  
    // Shadows
    shadows: {
      glow: {
        cyan: 'shadow-2xl shadow-cyan-500/20',
        emerald: 'shadow-2xl shadow-emerald-500/20',
        primary: 'shadow-2xl shadow-cyan-500/50',
      },
      card: 'shadow-lg shadow-black/50',
      elevated: 'shadow-2xl shadow-black/60',
    },
  
    // Typography
    typography: {
      fontFamily: {
        sans: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
      },
      fontSize: {
        xs: '0.75rem',    // 12px
        sm: '0.875rem',   // 14px
        base: '1rem',     // 16px
        lg: '1.125rem',   // 18px
        xl: '1.25rem',    // 20px
        '2xl': '1.5rem',  // 24px
        '3xl': '1.875rem', // 30px
        '4xl': '2.25rem', // 36px
        '5xl': '3rem',    // 48px
        '6xl': '3.75rem', // 60px
        '7xl': '4.5rem',  // 72px
      },
      fontWeight: {
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
        black: 900,
      },
    },
  
    // Animation Durations
    animation: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms',
      slower: '800ms',
    },
  
    // Z-Index Layers
    zIndex: {
      base: 0,
      dropdown: 10,
      sticky: 20,
      fixed: 30,
      modal: 40,
      popover: 50,
      tooltip: 60,
    },
  
    // Layout
    layout: {
      maxWidth: '1280px',
      containerPadding: {
        mobile: '1rem',
        tablet: '1.5rem',
        desktop: '2rem',
      },
    },
  
    // Transitions
    transitions: {
      default: 'transition-all duration-300 ease-in-out',
      fast: 'transition-all duration-150 ease-in-out',
      slow: 'transition-all duration-500 ease-in-out',
      colors: 'transition-colors duration-300 ease-in-out',
      transform: 'transition-transform duration-300 ease-in-out',
    },
  
    // Border Widths
    borderWidth: {
      thin: '1px',
      default: '2px',
      thick: '3px',
    },
  
    // Opacity Values
    opacity: {
      disabled: 0.5,
      hover: 0.8,
      muted: 0.6,
    },
  };
  
  // Utility function to get severity styles
  export const getSeverityStyles = (severity: 'critical' | 'high' | 'medium' | 'low' | 'safe') => {
    return designTokens.colors.severity[severity];
  };
  
  // Utility function for glassmorphism effect
  export const glassEffect = {
    base: 'bg-slate-900/50 backdrop-blur-xl',
    border: 'border border-cyan-500/20',
    hover: 'hover:bg-slate-900/70 hover:border-cyan-500/40',
    full: 'bg-slate-900/50 backdrop-blur-xl border border-cyan-500/20 hover:bg-slate-900/70 hover:border-cyan-500/40 transition-all duration-300',
  };
  
  // Utility function for cyber grid background
  export const cyberGridBg = `
    background-image: 
      linear-gradient(to right, rgba(6, 182, 212, 0.1) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(6, 182, 212, 0.1) 1px, transparent 1px);
    background-size: 60px 60px;
  `;
  
  export default designTokens;