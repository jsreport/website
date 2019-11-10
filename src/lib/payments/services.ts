import Braintree from "./braintree";
import { CustomerRepository, Sale, Product, Customer } from "./customer";
import { Db } from "mongodb";

export type Services = {
    sendEmail?: (Mail) => void,
    braintree?: Braintree
    notifyLicensingServer?: (customer: Customer, product: Product, sale: Sale) => Promise<any>
    customerRepository?: CustomerRepository,
    renderInvoice?: (sale: Sale) => Promise<any>,
    db?: Db
}

