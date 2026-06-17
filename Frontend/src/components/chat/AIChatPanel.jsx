import { useRef, useState } from 'react'
import { Send, Bot } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { askChatbot } from '../../api/chatbot.js'
import { getErrorMessage } from '../../utils/helpers.js'

export function AIChatPanel({ welcome }) {
  const [messages, setMessages] = useState(
    welcome ? [{ role: 'ai', text: welcome }] : []
  )
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const textareaRef = useRef(null)
  const bottomRef = useRef(null)

  const handleSend = async () => {
    const trimmed = text.trim()
    if (!trimmed || sending) return
    setSending(true)
    setError('')

    // Optimistically add user message
    setMessages(prev => [...prev, { role: 'user', text: trimmed }])
    setText('')

    try {
      const { data } = await askChatbot({ question: trimmed })  // ✅ correct key
      setMessages(prev => [...prev, { role: 'ai', text: data.answer }])
    } catch (e) {
      setError(getErrorMessage(e))
      setMessages(prev => [...prev, { role: 'ai', text: '⚠ Sorry, I could not respond. Please try again.' }])
    } finally {
      setSending(false)
      textareaRef.current?.focus()
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
    }
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      void handleSend()
    }
  }

  return (
    <div
      className="flex flex-col overflow-hidden rounded-2xl border border-violet-100/80 bg-white/60 backdrop-blur"
      style={{ height: '580px' }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-violet-100/80 bg-white/80 px-4 py-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-100 text-violet-700">
          <Bot className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900">AI Assistant</p>
          <p className="text-xs text-slate-400">PolypCare AI · Powered by Groq</p>
        </div>
        <span className="ml-auto flex h-2 w-2 rounded-full bg-emerald-400" title="Online" />
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.length === 0 && (
          <p className="mt-10 text-center text-xs text-slate-400">
            Ask me anything about polyps or colon health.
          </p>
        )}

        {messages.map((msg, i) => {
          const isUser = msg.role === 'user'
          return (
            <div key={i} className={`flex items-end gap-2 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
              {!isUser && (
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-100 text-[10px] font-semibold text-violet-700">
                  AI
                </div>
              )}
              <div className={`max-w-[75%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${
                isUser
                  ? 'rounded-br-sm bg-violet-600 text-white'
                  : 'rounded-bl-sm border border-slate-100 bg-white text-slate-800 chat-markdown'
              }`}>
                {isUser ? msg.text : <ReactMarkdown>{msg.text}</ReactMarkdown>}
              </div>
            </div>
          )
        })}

        {sending && (
          <div className="flex items-end gap-2">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-100 text-[10px] font-semibold text-violet-700">AI</div>
            <div className="rounded-2xl rounded-bl-sm border border-slate-100 bg-white px-4 py-2 text-sm text-slate-400">
              Thinking…
            </div>
          </div>
        )}

        {error && <p className="text-center text-xs text-rose-500">{error}</p>}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
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
          placeholder="Ask about polyps, symptoms, screening… (Enter to send)"
          disabled={sending}
          className="flex-1 resize-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-violet-400 focus:ring-2 focus:ring-violet-100 disabled:opacity-50"
          style={{ minHeight: '38px', maxHeight: '100px' }}
        />
        <button
          onClick={handleSend}
          disabled={sending || !text.trim()}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-600 text-white transition hover:bg-violet-700 active:scale-95 disabled:opacity-40"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}