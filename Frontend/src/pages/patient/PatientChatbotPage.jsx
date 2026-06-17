import { PageHeader } from '../../components/ui/PageHeader.jsx'
import { AIChatPanel } from '../../components/chat/AIChatPanel.jsx'  // ✅

export function PatientChatbotPage() {
  return (
    <div>
      <PageHeader
        title="Health assistant"
        subtitle="General education about screening and reports — not personalized medical advice."
      />
      <AIChatPanel welcome="Hello! I'm PolypCare AI. How can I help you today?" />
    </div>
  )
}