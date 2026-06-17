import { PageHeader } from '../../components/ui/PageHeader.jsx'
import { AIChatPanel } from '../../components/chat/AIChatPanel.jsx'  // ✅

export function DoctorChatbotPage() {
  return (
    <div>
      <PageHeader
        title="AI clinical assistant"
        subtitle="Ask about screening guidelines, report semantics, or documentation tips."
      />
      <AIChatPanel welcome="Hello doctor — I am your healthcare partner. How can I assist?" />
    </div>
  )
}