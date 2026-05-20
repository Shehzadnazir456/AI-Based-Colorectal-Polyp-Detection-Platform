import { PageHeader } from '../../components/ui/PageHeader.jsx'
import { ChatPanel } from '../../components/chat/ChatPanel.jsx'

export function PatientChatbotPage() {
  return (
    <div>
      <PageHeader
        title="Health assistant"
        subtitle="General education about screening and reports — not personalized medical advice. Contact your clinician for decisions."
      />
      <ChatPanel welcome="Hello — I can explain terminology in your reports or how polyp screening works at a high level. What would you like to know?" />
    </div>
  )
}
