import StripeFacade from './stripe'
import { CustomerRepository, Sale, Product, Customer } from './customer'
import { Db } from 'mongodb'

export type Services = {
  sendEmail?: (Mail: any) => void,
  stripe?: StripeFacade,
  notifyLicensingServer?: (customer: Customer, product: Product, sale: Sale) => Promise<any>,
  customerRepository?: CustomerRepository,
  renderInvoice?: (sale: Sale) => Promise<any>,
  db?: Db
}
