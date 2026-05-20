import { PageHeader } from '../../components/ui/PageHeader.jsx'
import { ChatPanel } from '../../components/chat/ChatPanel.jsx'

export function DoctorChatbotPage() {
  return (
    <div>
      <PageHeader
        title="AI clinical assistant"
        subtitle="Ask about screening guidelines, report semantics, or documentation tips — not a substitute for attending physicians."
      />
      <ChatPanel welcome="Hello doctor — I can help summarize workflow steps or explain imaging terminology. How can I assist?" />
    </div>
  )
}
