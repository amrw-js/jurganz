import { useMutation } from '@tanstack/react-query'

import { ContactError, ContactFormData, ContactResponse } from '@/types/contact.types'

import { API_BASE_URL } from '../utils/constants'

const submitContactForm = async (data: ContactFormData): Promise<ContactResponse> => {
  const response = await fetch(`${API_BASE_URL}/contact`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      phone: data.phone?.trim() || undefined,
      company: data.company?.trim() || undefined,
      subject: data.subject?.trim() || undefined,
      message: data.message.trim(),
    }),
  })

  if (!response.ok) {
    const errorData: ContactError = await response.json()
    throw new Error(errorData.error || 'Failed to submit contact form')
  }

  return response.json()
}

// Custom hook
export const useSubmitContactForm = () => {
  return useMutation({
    mutationFn: submitContactForm,
    onSuccess: (data) => {
      console.log('Contact form submitted successfully:', data)
    },
    onError: (error) => {
      console.error('Contact form submission failed:', error)
    },
  })
}

// Alternative hook with more options
export const useContactForm = () => {
  const mutation = useMutation({
    mutationFn: submitContactForm,
    retry: 1, // Retry once on failure
    retryDelay: 1000, // Wait 1 second before retry
  })

  return {
    submitForm: mutation.mutate,
    submitFormAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
    data: mutation.data,
    reset: mutation.reset,
  }
}
