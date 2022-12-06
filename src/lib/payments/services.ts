import StripeFacade from './stripe'
import { CustomerRepository, Sale, Product, Customer } from './customer'
import { Db } from 'mongodb'

export type Services = {
  sendEmail?: (Mail: any) => void,
  stripe?: StripeFacade,
  notifyLicensingServer?: (customer: Customer, product: Product, sale: Sale) => Promise<any>,
  notifyWebhook?: (customer: Customer, product: Product, event: string) => Promise<any>,
  customerRepository?: CustomerRepository,
  renderInvoice?: (sale: Sale, templatePath?: String, extension?: String) => Promise<any>,
  readInvoice?: (blobName: string) => Promise<Buffer>
  db?: Db
}
