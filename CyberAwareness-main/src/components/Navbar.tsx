import { useState } from 'react';
import { Shield, Menu, X, Bot } from 'lucide-react';

const navLinks = [
  { label: 'Awareness', href: '#awareness' },
  { label: 'Cyber Laws', href: '/laws' },
  { label: 'Report', href: '/incident-reporting' },
  { label: 'Learning', href: '#learning' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2 group">
            <div className="relative">
              <Shield className="w-8 h-8 text-cyan-400 group-hover:text-cyan-300 transition-colors" strokeWidth={2} />
              <div className="absolute inset-0 blur-sm bg-cyan-400/30 rounded-full group-hover:bg-cyan-300/40 transition-all" />
            </div>
            <span className="font-bold text-lg tracking-tight">
              <span className="text-cyan-400">Cybershield</span>
            </span>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-slate-300 hover:text-cyan-400 transition-colors relative group"
              >
                {link.label}
                <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-cyan-400 group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:flex items-center">
            <a href="#ai-assistant" className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-sm px-4 py-2 rounded-lg transition-all duration-200 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-400/30">
              <Bot className="w-4 h-4" />
              AI Guidance Assistant
            </a>
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden text-slate-300 hover:text-white transition-colors"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-slate-900 border-t border-slate-800 px-4 py-4 space-y-3">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="block text-sm font-medium text-slate-300 hover:text-cyan-400 transition-colors py-2"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <a href="#ai-assistant" className="w-full flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-sm px-4 py-2.5 rounded-lg transition-all mt-2">
            <Bot className="w-4 h-4" />
            AI Guidance Assistant
          </a>
        </div>
      )}
    </header>
  );
}
