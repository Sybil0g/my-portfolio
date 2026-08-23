import { useState } from "react";
import { NavLink } from "react-router-dom";
import siteContent from "../data/siteContent";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/skills", label: "Skills" },
  { to: "/projects", label: "Projects" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-cream/90 backdrop-blur-sm border-b border-blush">
      <nav className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        <NavLink
          to="/"
          onClick={() => setOpen(false)}
          className="font-display text-2xl text-ink tracking-tight"
        >
          {siteContent.name}
          <span className="text-rose">.</span>
        </NavLink>

        {/* Desktop nav: full list of links, unchanged */}
        <ul className="hidden md:flex items-center gap-8 font-body text-sm tracking-wide uppercase text-ink/80">
          {links.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                end={link.to === "/"}
                className={({ isActive }) =>
                  `pb-1 border-b-2 transition-colors ${
                    isActive
                      ? "border-rose text-rose"
                      : "border-transparent hover:text-rose"
                  }`
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Mobile: hamburger button, only visible below md breakpoint */}
        <button
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="md:hidden relative w-10 h-10 flex flex-col items-center justify-center gap-1.5"
        >
          <span
            className={`block w-6 h-0.5 bg-ink transition-transform duration-200 ${
              open ? "translate-y-2 rotate-45" : ""
            }`}
          />
          <span
            className={`block w-6 h-0.5 bg-ink transition-opacity duration-200 ${
              open ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block w-6 h-0.5 bg-ink transition-transform duration-200 ${
              open ? "-translate-y-2 -rotate-45" : ""
            }`}
          />
        </button>
      </nav>

      {/* Mobile dropdown panel — only relevant below md, since the button that opens it is hidden on md+ */}
      <div
        className={`md:hidden overflow-hidden transition-[max-height] duration-300 ease-in-out border-t border-blush ${
          open ? "max-h-96" : "max-h-0 border-t-0"
        }`}
      >
        <ul className="max-w-6xl mx-auto px-6 py-4 flex flex-col gap-1 font-body text-sm tracking-wide uppercase text-ink/80">
          {links.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                end={link.to === "/"}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `block py-3 border-b border-blush/60 transition-colors ${
                    isActive ? "text-rose" : "hover:text-rose"
                  }`
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
