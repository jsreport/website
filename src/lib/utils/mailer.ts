
import sendgrid from 'sendgrid'
import * as logger from './logger.js'
const helper = sendgrid.mail

export type Email = {
  to: string,
  subject: string,
  content: string
}

export const sendEmail = (Mail) => {
  const sg = sendgrid(process.env.SENDGRID)

  logger.info(`Sending email (${Mail.subject}) to ${Mail.to}`)

  const fromEmail = new helper.Email('sales@jsreport.net')
  const toEmail = new helper.Email(Mail.to)
  const contentEmail = new helper.Content('text/html', Mail.content)
  const mail = new helper.Mail(fromEmail, Mail.subject, toEmail, contentEmail)

  const request = sg.emptyRequest({
    method: 'POST',
    path: '/v3/mail/send',
    body: mail.toJSON()
  })

  return sg.API(request, (err, response) => {
    if (err) {
      logger.error('Error while sending mail:', err)
    } else {
      logger.info('sent succesfully')
    }
  })
}
