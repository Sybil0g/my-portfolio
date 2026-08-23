import siteContent from '../data/siteContent'

export default function ResumeButton({ variant = 'solid' }: { variant?: 'solid' | 'outline' }) {
  const base =
    'inline-flex items-center gap-2 font-body text-sm uppercase tracking-wide px-6 py-3 rounded-full transition-colors'
  const solid = 'bg-rose text-cream hover:bg-rose-deep'
  const outline = 'border border-rose text-rose hover:bg-rose hover:text-cream'

  return (
    <a
      href={siteContent.resumeUrl}
      download
      className={`${base} ${variant === 'solid' ? solid : outline}`}
    >
      Download Resume
      <span aria-hidden>↓</span>
    </a>
  )
}
