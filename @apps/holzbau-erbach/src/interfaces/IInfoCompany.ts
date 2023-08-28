import type { IBase } from './IBase'

export interface IInfoCompanyUnsaved {
  name: string
  street: string
  house_no: string
  postcode: string
  city: string
  mail: string
  phone: string
  facebook?: string
  instagram?: string
}

export interface IInfoCompany extends IBase, IInfoCompanyUnsaved {}
