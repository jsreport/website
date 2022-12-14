import { Services } from "./services";
import emailProcessor from "./emailProcessor";
import { interpolate } from "../utils/utils";

export const sendCustomerLink = (services: Services) => async (email: string) => {    
    let customer
    try {
        customer = await services.customerRepository.findByEmail(email)
    } catch (e) {
        return
    }

    await emailProcessor(services.sendEmail, 'customerLink', customer, {})
}
