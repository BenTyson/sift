import { Suspense } from 'react'
import { SignUpForm } from './SignUpForm'

export default function SignUpPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
        <div className="animate-pulse w-full max-w-md h-[500px] bg-muted rounded-xl" />
      </div>
    }>
      <SignUpForm />
    </Suspense>
  )
}
