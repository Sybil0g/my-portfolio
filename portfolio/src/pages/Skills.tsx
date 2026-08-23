import siteContent from '../data/siteContent'

export default function Skills() {
  return (
    <section className="max-w-5xl mx-auto px-6 py-20">
      <p className="font-body text-sm text-rose uppercase tracking-wide">What I work with</p>
      <h1 className="font-display text-4xl text-ink mt-3">
        Skills &amp; <span className="font-script text-rose text-5xl">tools.</span>
      </h1>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 mt-12">
        {siteContent.skillGroups.map((group) => (
          <div key={group.title} className="bg-white border border-blush rounded-2xl p-6">
            <h2 className="font-display text-xl text-rose-deep mb-4">{group.title}</h2>
            <ul className="space-y-2 font-body text-ink/80">
              {group.skills.map((skill) => (
                <li key={skill} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose shrink-0" />
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
