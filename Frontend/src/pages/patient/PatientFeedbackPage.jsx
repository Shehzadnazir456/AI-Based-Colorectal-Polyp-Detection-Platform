import { useEffect, useState } from 'react'
import { PageHeader } from '../../components/ui/PageHeader.jsx'
import { GlassCard } from '../../components/ui/GlassCard.jsx'
import { Textarea } from '../../components/ui/Textarea.jsx'
import { Button } from '../../components/ui/Button.jsx'
import { Spinner } from '../../components/ui/Spinner.jsx'
import { StarRating } from '../../components/feedback/StarRating.jsx'
import { Badge } from '../../components/ui/Badge.jsx'
import * as feedbackApi from '../../api/feedback.js'
import { normalizeList, formatDate, getErrorMessage } from '../../utils/helpers.js'

export function PatientFeedbackPage() {
  const [rating, setRating] = useState(5)
  const [comments, setComments] = useState('')
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const load = async () => {
    setLoading(true)
    try {
      const { data } = await feedbackApi.getMyFeedback()
      setItems(normalizeList(data))
    } catch (e) {
      setError(getErrorMessage(e))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const onSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      await feedbackApi.submitFeedback({ rating, comments, comment: comments })
      setComments('')
      await load()
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <PageHeader title="Feedback" subtitle="Rate your portal experience and share suggestions." />

      <div className="grid gap-6 lg:grid-cols-2">
        <GlassCard>
          <h3 className="text-lg font-semibold text-slate-900">Your voice matters</h3>
          <form onSubmit={onSubmit} className="mt-6 space-y-6">
            <div>
              <span className="mb-2 block text-sm font-medium text-slate-800">Rating</span>
              <StarRating value={rating} onChange={setRating} />
            </div>
            <Textarea
              label="Comments"
              name="comments"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows={5}
            />
            {error ? <p className="text-sm text-rose-600">{error}</p> : null}
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Sending…' : 'Submit feedback'}
            </Button>
          </form>
        </GlassCard>

        <GlassCard>
          <h3 className="text-lg font-semibold text-slate-900">Previous feedback</h3>
          {loading ? (
            <div className="mt-8 flex justify-center">
              <Spinner />
            </div>
          ) : (
            <ul className="mt-6 space-y-4">
              {items.length === 0 ? (
                <li className="text-sm text-slate-500">No feedback submitted yet.</li>
              ) : (
                items.map((f, i) => (
                  <li key={f.id ?? i} className="rounded-xl border border-violet-100/80 bg-white/60 p-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="warning">{f.rating ?? '—'} / 5</Badge>
                      <span className="text-xs text-slate-400">{formatDate(f.created_at || f.date)}</span>
                    </div>
                    <p className="mt-2 text-sm text-slate-700">{f.comments || f.comment || f.message}</p>
                  </li>
                ))
              )}
            </ul>
          )}
        </GlassCard>
      </div>
    </div>
  )
}
