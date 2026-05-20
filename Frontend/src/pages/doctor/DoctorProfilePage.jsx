import { useEffect, useState } from 'react'
import { PageHeader } from '../../components/ui/PageHeader.jsx'
import { GlassCard } from '../../components/ui/GlassCard.jsx'
import { Input } from '../../components/ui/Input.jsx'
import { Button } from '../../components/ui/Button.jsx'
import { Spinner } from '../../components/ui/Spinner.jsx'
import * as doctorApi from '../../api/doctor.js'
import { getErrorMessage } from '../../utils/helpers.js'

export function DoctorProfilePage() {
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    specialty: '',
    license_number: '',
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
        const { data } = await doctorApi.getDoctorProfile()
        if (!cancelled) {
          setForm((f) => ({
            ...f,
            first_name: data.first_name ?? '',
            last_name: data.last_name ?? '',
            email: data.email ?? '',
            specialty: data.specialty ?? '',
            license_number: data.license_number ?? data.license ?? '',
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
      await doctorApi.updateDoctorProfile(form)
      setSuccess('Profile updated successfully.')
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <PageHeader title="Clinician profile" subtitle="Update your professional details shown across the workspace." />

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
            <Input label="Specialty" name="specialty" value={form.specialty} onChange={onChange} />
            <Input label="License number" name="license_number" value={form.license_number} onChange={onChange} />
            {error ? <p className="text-sm text-rose-600">{error}</p> : null}
            {success ? <p className="text-sm text-emerald-700">{success}</p> : null}
            <Button type="submit" disabled={saving}>
              {saving ? 'Saving…' : 'Save changes'}
            </Button>
          </form>
        </GlassCard>
      )}
    </div>
  )
}
