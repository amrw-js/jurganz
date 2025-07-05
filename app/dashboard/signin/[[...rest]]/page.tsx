'use client'

import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <div className='flex min-h-screen items-center justify-center p-4'>
      <SignIn
        appearance={{
          elements: {
            formButtonPrimary: 'bg-blue-600 hover:bg-blue-700 text-sm',
          },
        }}
        redirectUrl='/dashboard'
        signUpUrl='/dashboard/signup'
      />
    </div>
  )
}
