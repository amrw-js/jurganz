export interface ProductionLine {
  id: string
  // Personal Info
  companyName: string
  fullName: string
  emailAddress: string
  phoneNumber: string
  // Production Line Info
  productType: string
  containerType: string
  capacity: string
  yearOfManufacturing: number
  fillingProcess: string
  fillingType: string
  controlPLC: string
  lineMachines: string
  approximateWorkingTime: string
  localCurrency: string
  price: number
  negotiable: boolean
  isAvailableNow: boolean
  expectedAvailableDate?: string
  published: boolean
  photos?: ProductionLineMedia[]
  createdAt: Date
  updatedAt: Date
}

export interface ProductionLineMedia {
  id: string
  url: string
  type: 'image' | 'video'
  name: string
  size?: number
  createdAt?: Date
}

export interface ProductionLineFormData {
  // Personal Info
  companyName: string
  fullName: string
  emailAddress: string
  phoneNumber: string
  // Production Line Info
  productType: string
  containerType: string
  capacity: string
  yearOfManufacturing: number
  fillingProcess: string
  fillingType: string
  controlPLC: string
  lineMachines: string
  approximateWorkingTime: string
  localCurrency: string
  price: number
  negotiable: boolean
  isAvailableNow: boolean
  expectedAvailableDate?: string
  published: boolean
  photos: File[]
}
