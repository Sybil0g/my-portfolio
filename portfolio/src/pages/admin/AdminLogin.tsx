import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function AdminLogin() {
  const { login, user } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (user) {
    navigate('/admin', { replace: true })
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await login(email, password)
      navigate('/admin', { replace: true })
    } catch {
      setError('Could not sign in. Check your email and password.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="max-w-sm mx-auto px-6 py-24">
      <h1 className="font-display text-3xl text-ink">Admin sign in</h1>
      <p className="font-body text-sm text-muted mt-2">
        This is just for you — sign in to add, edit, or remove projects.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label className="font-body text-xs uppercase tracking-wide text-muted">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mt-1 px-4 py-2.5 rounded-lg border border-blush focus:outline-none focus:border-rose font-body"
          />
        </div>
        <div>
          <label className="font-body text-xs uppercase tracking-wide text-muted">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mt-1 px-4 py-2.5 rounded-lg border border-blush focus:outline-none focus:border-rose font-body"
          />
        </div>

        {error && <p className="font-body text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full font-body text-sm uppercase tracking-wide px-6 py-3 rounded-full bg-rose text-cream hover:bg-rose-deep transition-colors disabled:opacity-60"
        >
          {submitting ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </section>
  )
}
