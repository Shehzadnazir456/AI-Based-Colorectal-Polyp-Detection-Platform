import { useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ImagePlus, Sparkles } from 'lucide-react'
import { PageHeader } from '../../components/ui/PageHeader.jsx'
import { GlassCard } from '../../components/ui/GlassCard.jsx'
import { Button } from '../../components/ui/Button.jsx'
import * as doctorApi from '../../api/doctor.js'
import { getErrorMessage } from '../../utils/helpers.js'

export function UploadReportPage() {
  const { patientId } = useParams()
  const navigate = useNavigate()
  const fileRef = useRef(null)
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const onPick = (e) => {
    const f = e.target.files?.[0]
    setFile(f || null)
    if (preview) URL.revokeObjectURL(preview)
    setPreview(f ? URL.createObjectURL(f) : null)
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!file) {
      setError('Choose an image file to upload.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const formData = new FormData()
      formData.append('image', file)
      formData.append('file', file)

      const { data } = await doctorApi.uploadDoctorPatientReport(patientId, formData)
      const reportId = data?.id ?? data?.pk ?? data?.report_id
      navigate(`/doctor/patients/${patientId}/result/${reportId ?? ''}`, {
        replace: true,
        state: { result: data },
      })
    } catch (err) {
      setError(getErrorMessage(err))
      setLoading(false)
    }
  }

  return (
    <div>
      <PageHeader
        title="Upload imaging"
        subtitle="Submit endoscopy stills for AI-assisted colorectal polyp screening. Images are sent securely to your API."
        actions={
          <Button variant="ghost" type="button" onClick={() => navigate(-1)}>
            Back
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <GlassCard>
          <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
            <ImagePlus className="h-5 w-5 text-violet-600" />
            Select image
          </h3>
          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onPick} />
            <Button type="button" variant="secondary" className="w-full" onClick={() => fileRef.current?.click()}>
              Browse files
            </Button>
            {file ? (
              <p className="text-sm text-slate-600">
                Selected: <strong>{file.name}</strong>
              </p>
            ) : null}
            {error ? <p className="text-sm text-rose-600">{error}</p> : null}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Uploading & analyzing…' : 'Run AI analysis'}
            </Button>
          </form>
        </GlassCard>

        <GlassCard>
          <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
            <Sparkles className="h-5 w-5 text-indigo-500" />
            Preview
          </h3>
          <div className="mt-6 flex min-h-[240px] items-center justify-center overflow-hidden rounded-2xl border border-dashed border-violet-200/80 bg-violet-50/30">
            {preview ? (
              <img src={preview} alt="Upload preview" className="max-h-80 w-full object-contain" />
            ) : (
              <p className="px-4 text-center text-sm text-slate-500">No image selected yet.</p>
            )}
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
