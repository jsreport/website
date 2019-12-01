import { Services } from "./services";
import { Emails } from "./emails";
import { interpolate } from "../utils/utils";

export const sendCustomerLink = (services: Services) => async (email: string) => {
    let customer
    try {
        customer = await services.customerRepository.findByEmail(email)
    } catch (e) {
        return
    }

    services.sendEmail({
        to: customer.email,
        subject: Emails.customerLink.subject,
        content: interpolate(Emails.customerLink.content, { customer })
    })
}
