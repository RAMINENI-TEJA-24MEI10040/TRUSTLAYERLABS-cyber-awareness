import { Shield, Phone, Lock, ExternalLink, Twitter, Youtube, Instagram } from 'lucide-react';

const footerLinks = {
  Platform: ['Cyber Awareness', 'Indian Cyber Law', 'Incident Reporting', 'Interactive Learning'],
  Resources: ['IPC/BNS Guide', 'IT Act Simplified', 'Scam Alert Database', 'Victim Support'],
  Legal: ['Privacy Policy', 'Terms of Use', 'Disclaimer', 'Cookie Policy'],
};

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 transition-colors duration-300">
      {/* Emergency Banner */}
      <div className="bg-gradient-to-r from-red-100 to-red-200 dark:from-red-950/80 dark:to-red-900/60 border-b border-red-200 dark:border-red-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-500/20 border border-red-500/30 rounded-xl flex items-center justify-center flex-shrink-0">
                <Phone className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <p className="text-gray-900 dark:text-white font-bold text-sm">National Cyber Crime Helpline</p>
                <p className="text-gray-600 dark:text-gray-400 text-xs">Report cyber crimes 24/7 — Free &amp; Confidential</p>
              </div>
            </div>
            <a
              href="tel:1930"
              className="flex items-center gap-2 bg-red-500 hover:bg-red-400 text-white font-bold text-lg px-6 py-2 rounded-xl transition-colors duration-300 shadow-lg shadow-red-500/20"
            >
              1930
            </a>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="relative">
                <Shield className="w-7 h-7 text-cyan-400" strokeWidth={2} />
                <div className="absolute inset-0 blur-sm bg-cyan-400/25 rounded-full" />
              </div>
              <span className="font-bold text-lg">
                <span className="text-cyan-400">Cybershield</span>
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-6 max-w-xs">
              India's trusted platform for cyber awareness, digital safety education, and legal guidance under the IT Act and IPC/BNS.
            </p>

            {/* Trust Badges */}
            <div className="flex flex-col gap-2 mb-6">
              <div className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 w-fit transition-colors duration-300">
                <Lock className="w-3.5 h-3.5 text-green-400" />
                <span>Secure &amp; Encrypted Communication</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 w-fit transition-colors duration-300">
                <Shield className="w-3.5 h-3.5 text-cyan-400" />
                <span>User Privacy Protected — No Data Sold</span>
              </div>
            </div>

            {/* Social */}
            <div className="flex gap-3">
              {[Twitter, Youtube, Instagram].map((Icon, i) => (
                <button
                  key={i}
                  className="w-9 h-9 bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg flex items-center justify-center text-gray-700 dark:text-gray-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-all duration-300"
                >
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-gray-900 dark:text-white font-semibold text-sm mb-4 transition-colors duration-300">{category}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-gray-600 dark:text-gray-400 text-sm hover:text-cyan-400 transition-colors duration-300 flex items-center gap-1 group"
                    >
                      {link}
                      <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-gray-300 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-600 dark:text-gray-500 transition-colors duration-300">
          <p>
            &copy; {new Date().getFullYear()} Cybershield. All rights reserved. Educational use only.
          </p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              All systems operational
            </span>
            <span>MeitY Compliant</span>
            <span>CERT-In Aligned</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
