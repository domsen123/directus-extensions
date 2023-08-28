import type { IBase } from './IBase'

export interface IInquiryUnsaved {
  name: string
  phone: string
  topic: string
  postcode: string
  message?: string
}

export interface IInquiry extends Pick<IBase, 'id' | 'date_created'>, IInquiryUnsaved {}
