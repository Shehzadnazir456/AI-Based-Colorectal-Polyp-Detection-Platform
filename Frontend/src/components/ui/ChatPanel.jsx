import { useEffect, useRef, useState } from 'react'
import { Send } from 'lucide-react'
import { normalizeList, getErrorMessage } from '../../utils/helpers.js'

function formatTime(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  let h = d.getHours()
  const m = d.getMinutes()
  const ampm = h >= 12 ? 'PM' : 'AM'
  h = h % 12 || 12
  return `${h}:${String(m).padStart(2, '0')} ${ampm}`
}

function formatDayLabel(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  const today = new Date()
  const yesterday = new Date()
  yesterday.setDate(today.getDate() - 1)
  if (d.toDateString() === today.toDateString()) return 'Today'
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday'
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

function initials(name = '') {
  return name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase() || '?'
}

export function ChatPanel({
  currentRole,
  otherName,
  fetchMessages,
  postMessage,
  pollInterval = 5000,
}) {
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const textareaRef = useRef(null)

  // ── NO bottomRef, NO scroll useEffect ──

  const load = async (silent = false) => {
    try {
      const { data } = await fetchMessages()
      setMessages(normalizeList(data))
    } catch (e) {
      if (!silent) setError(getErrorMessage(e))
    }
  }

  useEffect(() => {
    void load(false)
    const id = setInterval(() => load(true), pollInterval)
    return () => clearInterval(id)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleSend = async () => {
    const trimmed = text.trim()
    if (!trimmed || sending) return
    setSending(true)
    setError('')
    try {
      await postMessage(trimmed)
      setText('')
      await load(true)
    } catch (e) {
      setError(getErrorMessage(e))
    } finally {
      setSending(false)
      textareaRef.current?.focus()
    }
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      void handleSend()
    }
  }

  // group messages by day
  const grouped = []
  let lastDay = null
  for (const msg of messages) {
    const iso = msg.created_at || msg.timestamp || msg.sent_at
    const dayLabel = formatDayLabel(iso)
    if (dayLabel !== lastDay) {
      grouped.push({ type: 'divider', label: dayLabel, key: `div-${iso}-${Math.random()}` })
      lastDay = dayLabel
    }
    grouped.push({ type: 'msg', msg })
  }

  const otherInitials = initials(otherName)

  return (
    <div
      className="flex flex-col overflow-hidden rounded-2xl border border-violet-100/80 bg-white/60 backdrop-blur"
      style={{ height: '520px' }}
    >
      {/* ── Header ── */}
      <div className="flex items-center gap-3 border-b border-violet-100/80 bg-white/80 px-4 py-3">
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-violet-100 text-xs font-semibold text-violet-700">
          {otherInitials}
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900">{otherName}</p>
          <p className="text-xs text-slate-400">
            {currentRole === 'doctor' ? 'Patient' : 'Your doctor'}
          </p>
        </div>
        <span className="ml-auto flex h-2 w-2 rounded-full bg-emerald-400" title="Online" />
      </div>

      {/* ── Messages ── */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
        {error && (
          <p className="mb-2 text-center text-xs text-rose-500">{error}</p>
        )}
        {messages.length === 0 && !error && (
          <p className="mt-10 text-center text-xs text-slate-400">
            No messages yet. Say hello!
          </p>
        )}

        {grouped.map((item) => {
          if (item.type === 'divider') {
            return (
              <div key={item.key} className="flex items-center gap-2 py-3">
                <div className="h-px flex-1 bg-slate-100" />
                <span className="text-xs text-slate-400">{item.label}</span>
                <div className="h-px flex-1 bg-slate-100" />
              </div>
            )
          }

          const { msg } = item
          const senderRole = msg.sender_role || msg.sender || msg.role
          const isMe = senderRole === currentRole
          const iso = msg.created_at || msg.timestamp || msg.sent_at
          const body = msg.message || msg.text || msg.content || msg.body || ''

          return (
            <div
              key={msg.id ?? iso}
              className={`flex items-end gap-2 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {!isMe && (
                <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-violet-100 text-[10px] font-semibold text-violet-700">
                  {otherInitials}
                </div>
              )}

              <div className={`flex max-w-[68%] flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                <div
                  className={`rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${
                    isMe
                      ? 'rounded-br-sm bg-violet-600 text-white'
                      : 'rounded-bl-sm border border-slate-100 bg-white text-slate-800'
                  }`}
                >
                  {body}
                </div>
                <span className="mt-1 text-[10px] text-slate-400">
                  {formatTime(iso)}
                  {isMe && <span className="ml-1 text-violet-400">✓✓</span>}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* ── Input ── */}
      <div className="flex items-end gap-2 border-t border-violet-100/80 bg-white/80 px-3 py-3">
        <textarea
          ref={textareaRef}
          rows={1}
          value={text}
          onChange={(e) => {
            setText(e.target.value)
            e.target.style.height = 'auto'
            e.target.style.height = Math.min(e.target.scrollHeight, 100) + 'px'
          }}
          onKeyDown={handleKey}
          placeholder="Type a message… (Enter to send)"
          disabled={sending}
          className="flex-1 resize-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-violet-400 focus:ring-2 focus:ring-violet-100 disabled:opacity-50"
          style={{ minHeight: '38px', maxHeight: '100px' }}
        />
        <button
          onClick={handleSend}
          disabled={sending || !text.trim()}
          className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-violet-600 text-white transition hover:bg-violet-700 active:scale-95 disabled:opacity-40"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
