import siteContent from '../data/siteContent'
import ResumeButton from '../components/ResumeButton'

export default function Contact() {
  return (
    <section className="max-w-4xl mx-auto px-6 py-20">
      <p className="font-body text-sm text-rose uppercase tracking-wide">Get in touch</p>
      <h1 className="font-display text-4xl text-ink mt-3">
        Let’s bring ideas to life <span className="font-script text-rose text-5xl">together.</span>
      </h1>
      <p className="font-body text-muted mt-4 max-w-md">{siteContent.contact.availability}</p>

      <div className="grid sm:grid-cols-2 gap-8 mt-10">
        <div className="space-y-4 font-body text-ink/80">
          <div>
            <p className="text-xs uppercase tracking-wide text-rose">Email</p>
            <a href={`mailto:${siteContent.contact.email}`} className="hover:text-rose-deep">
              {siteContent.contact.email}
            </a>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-rose">Location</p>
            <p>{siteContent.contact.location}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-rose">Elsewhere</p>
            <div className="flex gap-4 mt-1">
              {siteContent.contact.socials.map((s) => (
                <a key={s.label} href={s.url} target="_blank" rel="noreferrer" className="hover:text-rose-deep">
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-start">
          <ResumeButton />
        </div>
      </div>
    </section>
  )
}
