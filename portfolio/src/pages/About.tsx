import siteContent from '../data/siteContent'
import ResumeButton from '../components/ResumeButton'
// Reusing the same photo you already added for the landing page.
// Swap this import if you'd rather use a different photo here.
import profileImage from '../assets/grad-pic.jpg'

export default function About() {
  return (
    <section className="max-w-4xl mx-auto px-6 py-20 text-center">
      <img
        src={profileImage}
        alt="Alexis"
        className="w-40 h-40 rounded-full object-cover mx-auto border border-blush"
      />

      <p className="font-body text-sm text-rose uppercase tracking-wide mt-8">{siteContent.about.eyebrow}</p>
      <h1 className="font-display text-4xl text-ink mt-3 leading-snug">{siteContent.about.heading}</h1>

      <div className="mt-8 space-y-5 font-body text-ink/80 leading-relaxed text-left max-w-2xl mx-auto">
        {siteContent.about.paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      <div className="mt-10">
        <ResumeButton />
      </div>
    </section>
  )
}