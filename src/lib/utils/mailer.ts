
import sendgrid from '@sendgrid/mail'
import * as logger from './logger.js'

export type Email = {
  to: string,
  subject: string,
  content: string
}

export const sendEmail = async (Mail: Email) => {
  sendgrid.setApiKey(process.env.SENDGRID)
  
  logger.info(`Sending email (${Mail.subject}) to ${Mail.to}`)

  const msg = {
    from: 'sales@jsreport.net',
    to: Mail.to.split(','),
    subject: Mail.subject,
    html: Mail.content
  }

  try {
    await sendgrid.send(msg)
    logger.info('sent succesfully')
  } catch (e) {
    logger.error('Error while sending mail:', e)
  }  
}
