import { Menu, ShieldCheck, X } from "lucide-react";
import { useState } from "react";

const links = [
  ["Intel", "#education"],
  ["Simulator", "#simulator"],
  ["Results", "#results"],
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="ph-nav">
      <a className="ph-brand" href="#top">
        <ShieldCheck size={22} />
        <span>PhishGuard</span>
      </a>
      <button className="ph-icon-btn md:hidden" onClick={() => setOpen((v) => !v)} aria-label="Toggle navigation">
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>
      <div className={`ph-nav-links ${open ? "flex" : "hidden"} md:flex`}>
        {links.map(([label, href]) => (
          <a key={href} href={href} onClick={() => setOpen(false)}>
            {label}
          </a>
        ))}
      </div>
    </nav>
  );
}
