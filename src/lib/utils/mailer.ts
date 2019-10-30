
import sendgrid from 'sendgrid'
import * as logger from './logger.js'
const helper = sendgrid.mail

module.exports = ({
  subject,
  from,
  to,
  content
}) => {
  const sg = sendgrid(process.env.SENDGRID)

  logger.info(`Sending email (${subject}) to ${to}`)

  const fromEmail = new helper.Email(from || 'support@jsreport.net')
  const toEmail = new helper.Email(to)
  const contentEmail = new helper.Content('text/plain', content)
  const mail = new helper.Mail(fromEmail, subject, toEmail, contentEmail)

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
