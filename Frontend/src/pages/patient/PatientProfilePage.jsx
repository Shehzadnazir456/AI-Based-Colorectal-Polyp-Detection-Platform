import { useEffect, useState } from 'react'
import { PageHeader } from '../../components/ui/PageHeader.jsx'
import { GlassCard } from '../../components/ui/GlassCard.jsx'
import { Input } from '../../components/ui/Input.jsx'
import { Button } from '../../components/ui/Button.jsx'
import { Spinner } from '../../components/ui/Spinner.jsx'
import * as patientApi from '../../api/patient.js'
import { getErrorMessage } from '../../utils/helpers.js'

export function PatientProfilePage() {
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    date_of_birth: '',
    phone: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLoading(true)
      try {
        const { data } = await patientApi.getPatientProfile()
        if (!cancelled) {
          setForm((f) => ({
            ...f,
            first_name: data.first_name ?? '',
            last_name: data.last_name ?? '',
            email: data.email ?? '',
            date_of_birth: data.date_of_birth ?? data.dob ?? '',
            phone: data.phone ?? '',
          }))
        }
      } catch (e) {
        if (!cancelled) setError(getErrorMessage(e))
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const onChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')
    try {
      await patientApi.updatePatientProfile(form)
      setSuccess('Profile updated.')
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <PageHeader title="My profile" subtitle="Keep your demographic details accurate for your care team." />

      {loading ? (
        <Spinner />
      ) : (
        <GlassCard className="max-w-2xl">
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="First name" name="first_name" value={form.first_name} onChange={onChange} />
              <Input label="Last name" name="last_name" value={form.last_name} onChange={onChange} />
            </div>
            <Input label="Email" name="email" type="email" value={form.email} onChange={onChange} />
            <Input label="Date of birth" name="date_of_birth" type="date" value={form.date_of_birth} onChange={onChange} />
            <Input label="Phone" name="phone" type="tel" value={form.phone} onChange={onChange} />
            {error ? <p className="text-sm text-rose-600">{error}</p> : null}
            {success ? <p className="text-sm text-emerald-700">{success}</p> : null}
            <Button type="submit" disabled={saving}>
              {saving ? 'Saving…' : 'Save profile'}
            </Button>
          </form>
        </GlassCard>
      )}
    </div>
  )
}
