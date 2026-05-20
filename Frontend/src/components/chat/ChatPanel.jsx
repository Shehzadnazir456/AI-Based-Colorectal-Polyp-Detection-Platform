import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Bot, User, Sparkles } from 'lucide-react'
import * as chatbotApi from '../../api/chatbot.js'
import { Button } from '../ui/Button.jsx'
import { getErrorMessage } from '../../utils/helpers.js'

/**
 * Full-height medical AI chat: history load, ask endpoint, typing indicator.
 * @param {{ welcome?: string }} props
 */
export function ChatPanel({ welcome = 'Ask about polyp screening, report terminology, or workflow guidance.' }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [loadingHistory, setLoadingHistory] = useState(true)
  const [error, setError] = useState('')
  const bottomRef = useRef(null)

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLoadingHistory(true)
      try {
        const { data } = await chatbotApi.getChatbotHistory()
        const list = Array.isArray(data)
          ? data
          : data?.messages || data?.results || data?.history || []
        if (!cancelled && list.length) {
          const mapped = list.flatMap((row) => {
            if (row.role && row.content) {
              return [{ role: row.role, content: row.content }]
            }
            if (row.question && row.answer) {
              return [
                { role: 'user', content: row.question },
                { role: 'assistant', content: row.answer },
              ]
            }
            return []
          })
          setMessages(mapped.length ? mapped : [{ role: 'assistant', content: welcome }])
        } else if (!cancelled) {
          setMessages([{ role: 'assistant', content: welcome }])
        }
      } catch {
        if (!cancelled) setMessages([{ role: 'assistant', content: welcome }])
      } finally {
        if (!cancelled) setLoadingHistory(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [welcome])

  useEffect(() => {
    scrollToBottom()
  }, [messages, sending])

  const send = async () => {
    const text = input.trim()
    if (!text || sending) return
    setInput('')
    setError('')
    setMessages((m) => [...m, { role: 'user', content: text }])
    setSending(true)
    try {
      const { data } = await chatbotApi.askChatbot({
        message: text,
        question: text,
      })
      const reply =
        data?.answer ??
        data?.response ??
        data?.message ??
        data?.reply ??
        (typeof data === 'string' ? data : JSON.stringify(data))
      setMessages((m) => [...m, { role: 'assistant', content: String(reply) }])
    } catch (e) {
      setError(getErrorMessage(e))
      setMessages((m) => [
        ...m,
        {
          role: 'assistant',
          content: 'Sorry — I could not reach the assistant. Please try again.',
        },
      ])
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="flex h-[min(70vh,640px)] flex-col overflow-hidden rounded-2xl border border-white/50 bg-white/50 shadow-xl backdrop-blur-xl">
      <div className="flex items-center gap-3 border-b border-violet-100/80 bg-gradient-to-r from-violet-600/90 to-indigo-600/90 px-4 py-3 text-white">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-bold">Medical AI Assistant</p>
          <p className="text-xs text-violet-100/90">Endoscopy & pathology context</p>
        </div>
      </div>

      <div className="scrollbar-thin flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {loadingHistory ? (
          <p className="text-center text-sm text-slate-500">Loading conversation…</p>
        ) : null}
        {error ? <p className="text-center text-sm text-rose-600">{error}</p> : null}

        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={`${i}-${msg.content?.slice(0, 20)}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role !== 'user' ? (
                <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-600 text-white">
                  <Bot className="h-4 w-4" />
                </div>
              ) : null}
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
                  msg.role === 'user'
                    ? 'rounded-br-md bg-gradient-to-br from-violet-600 to-indigo-600 text-white'
                    : 'rounded-bl-md border border-violet-100/80 bg-white/90 text-slate-800'
                }`}
              >
                {msg.content}
              </div>
              {msg.role === 'user' ? (
                <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-200 text-slate-700">
                  <User className="h-4 w-4" />
                </div>
              ) : null}
            </motion.div>
          ))}
        </AnimatePresence>

        {sending ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 pl-2 text-sm text-violet-700"
          >
            <span className="flex gap-1">
              {[0, 1, 2].map((d) => (
                <motion.span
                  key={d}
                  className="inline-block h-2 w-2 rounded-full bg-violet-500"
                  animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }}
                  transition={{ repeat: Infinity, duration: 0.9, delay: d * 0.15 }}
                />
              ))}
            </span>
            Assistant is typing…
          </motion.div>
        ) : null}
        <div ref={bottomRef} />
      </div>

      <div className="border-t border-violet-100/80 bg-white/60 p-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && send()}
            placeholder="Type a question…"
            className="min-w-0 flex-1 rounded-xl border border-violet-200/80 bg-white/80 px-4 py-2.5 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-violet-400/50"
            disabled={sending}
            aria-label="Chat message"
          />
          <Button size="md" disabled={sending || !input.trim()} onClick={send} className="shrink-0">
            <Send className="h-4 w-4" />
            Send
          </Button>
        </div>
      </div>
    </div>
  )
}
