import { Suspense } from 'react'
import { LoginForm } from './LoginForm'

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
        <div className="animate-pulse w-full max-w-md h-96 bg-muted rounded-xl" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
