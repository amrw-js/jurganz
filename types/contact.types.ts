export interface ContactFormData {
  name: string
  email: string
  phone?: string
  company?: string
  subject?: string
  message: string
}

export interface ContactResponse {
  message: string
  emailId?: string
}

export interface ContactError {
  error: string
  message?: string[]
  statusCode?: number
}
