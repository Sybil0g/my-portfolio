import siteContent from "../data/siteContent";

export default function Footer() {
  return (
    <footer className="bg-rose-deep text-cream/90 mt-24">
      <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 font-body text-sm">
        <p>
          © {new Date().getFullYear()} {siteContent.name}. All rights reserved.
        </p>
        <div className="flex items-center gap-5">
          {siteContent.contact.socials.map((s) => (
            <a
              key={s.label}
              href={s.url}
              target="_blank"
              rel="noreferrer"
              className="uppercase tracking-wide hover:text-white transition-colors"
            >
              {s.label}
            </a>
          ))}
          {/* Quiet link into the admin area — not part of the public nav */}
          {/* <a href="/admin" className="uppercase tracking-wide text-cream/50 hover:text-white transition-colors">
            Admin
          </a> */}
        </div>
      </div>
    </footer>
  );
}
