import { useMutation } from '@tanstack/react-query'

import { API_BASE_URL } from '../utils/constants'

// Types
interface SendProductionLineEmailData {
  fullName: string
  companyName: string
  emailAddress: string
  phoneNumber: string
  message: string
  productionLineName: string
  containerType: string
  capacity: string
}

interface SendProductionLineEmailResponse {
  message: string
}

interface SendProductionLineEmailError {
  error: string
  message?: string[]
  statusCode?: number
}

// API function
const sendProductionLineEmail = async (data: SendProductionLineEmailData): Promise<SendProductionLineEmailResponse> => {
  const response = await fetch(`${API_BASE_URL}/production-line/send-email`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      fullName: data.fullName.trim(),
      companyName: data.companyName.trim(),
      emailAddress: data.emailAddress.trim().toLowerCase(),
      phoneNumber: data.phoneNumber.trim(),
      message: data.message.trim(),
      productionLineName: data.productionLineName.trim(),
      containerType: data.containerType.trim(),
      capacity: data.capacity.trim(),
    }),
  })

  if (!response.ok) {
    const errorData: SendProductionLineEmailError = await response.json()
    throw new Error(errorData.error || 'Failed to send production line email')
  }

  return response.json()
}

// Custom hook
export const useSendProductionLineEmail = () => {
  return useMutation({
    mutationFn: sendProductionLineEmail,
    onSuccess: (data) => {
      console.log('Production line email sent successfully:', data)
    },
    onError: (error) => {
      console.error('Production line email failed:', error)
    },
  })
}
