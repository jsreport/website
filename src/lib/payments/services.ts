import Braintree from "./braintree";
import { CustomerRepository, AccountingData, Invoice, Sale, Product, Customer } from "./customer";

export type Services = {
    sendEmail?: (Mail) => void,
    braintree?: Braintree
    notifyLicensingServer?: (customer: Customer, product: Product, sale: Sale) => Promise<any>
    customerRepository?: CustomerRepository,
    render?: (obj) => Promise<Buffer>
}

