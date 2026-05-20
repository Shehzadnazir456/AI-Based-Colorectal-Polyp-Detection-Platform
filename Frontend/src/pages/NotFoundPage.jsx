import { Link } from 'react-router-dom'
import { FileQuestion } from 'lucide-react'
import { Button } from '../components/ui/Button.jsx'

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="glass max-w-md rounded-3xl p-10 text-center">
        <FileQuestion className="mx-auto h-16 w-16 text-violet-500" />
        <h1 className="mt-6 text-2xl font-bold text-slate-900">Page not found</h1>
        <p className="mt-2 text-slate-600">The page you requested does not exist or was moved.</p>
        <Link to="/" className="mt-8 inline-block">
          <Button>Go home</Button>
        </Link>
      </div>
    </div>
  )
}
