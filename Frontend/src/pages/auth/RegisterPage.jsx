import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { isDoctor, isPatient } from '../../utils/authHelpers.js'
import { Input } from '../../components/ui/Input.jsx'
import { Button } from '../../components/ui/Button.jsx'
import { ROLES } from '../../utils/constants.js'
import { getErrorMessage } from '../../utils/helpers.js'

export function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    password_confirm: '',
    first_name: '',
    last_name: '',
    role: ROLES.PATIENT,
  })

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const onChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (form.password !== form.password_confirm) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)

    try {
      const user = await register({
        username: form.username,
        email: form.email,
        password: form.password,
        password2: form.password_confirm,
        first_name: form.first_name,
        last_name: form.last_name,
        role: form.role,
      })

      if (user) {
        if (isDoctor(user)) {
          navigate('/doctor/dashboard', { replace: true })
        } else if (isPatient(user)) {
          navigate('/patient/dashboard', { replace: true })
        } else {
          navigate('/login', { replace: true })
        }
      } else {
        navigate('/login', { replace: true })
      }
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-slate-900">Create account</h2>

      <p className="mt-1 text-sm text-slate-600">
        Register as a clinician or patient.
      </p>

      <form
        onSubmit={onSubmit}
        className="mt-8 max-h-[65vh] space-y-4 overflow-y-auto pr-1 scrollbar-thin"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="First name"
            name="first_name"
            value={form.first_name}
            onChange={onChange}
            required
          />

          <Input
            label="Last name"
            name="last_name"
            value={form.last_name}
            onChange={onChange}
            required
          />
        </div>

        <Input
          label="Username"
          name="username"
          value={form.username}
          onChange={onChange}
          required
        />

        <Input
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={onChange}
          required
        />

        <div>
          <span className="mb-1.5 block text-sm font-medium text-violet-950/85">
            Role
          </span>

          <select
            name="role"
            value={form.role}
            onChange={onChange}
            className="w-full rounded-xl border border-violet-200/80 bg-white/70 px-4 py-2.5 text-slate-800 outline-none focus:ring-2 focus:ring-violet-300/60"
          >
            <option value={ROLES.PATIENT}>Patient</option>
            <option value={ROLES.DOCTOR}>Doctor</option>
          </select>
        </div>

        <Input
          label="Password"
          name="password"
          type="password"
          autoComplete="new-password"
          value={form.password}
          onChange={onChange}
          required
        />

        <Input
          label="Confirm password"
          name="password_confirm"
          type="password"
          autoComplete="new-password"
          value={form.password_confirm}
          onChange={onChange}
          required
        />

        {error ? (
          <p className="text-sm text-rose-600">{error}</p>
        ) : null}

        <Button
          type="submit"
          className="w-full"
          disabled={loading}
        >
          {loading ? 'Creating account…' : 'Register'}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600">
        Already registered?{' '}
        <Link
          to="/login"
          className="font-semibold text-violet-700 hover:text-violet-900"
        >
          Sign in
        </Link>
      </p>
    </div>
  )
}