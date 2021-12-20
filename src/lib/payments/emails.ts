export const Emails = {
  checkout: {
    enterprise: {
      us: {
        subject: 'New sale ${product.name}',
        content: `\${customer.email}<br><a href='https://jsreport.net/payments/customer/\${customer.uuid}'>https://jsreport.net/payments/customer/\${customer.uuid}</a>`,
      },
      customer: {
        subject: 'You bought ${product.name}',
        content: `Hi,<br>
thank you for purchasing \${product.name}.<br>
<br>
Your license key is:<br>
\${product.licenseKey}<br>
<br>
Please see how you can apply the license key here:<br>
<a href='https://jsreport.net/learn/faq#how-to-apply-license-key'>https://jsreport.net/learn/faq#how-to-apply-license-key</a><br>
<br>
The invoice can be downloaded from your customer portal<br>
<a href='https://jsreport.net/payments/customer/\${customer.uuid}'>https://jsreport.net/payments/customer/\${customer.uuid}</a><br>
<br>
Having a technical question? Please ask on our <a href='https://forum.jsreport.net'>forum</a>.<br>
Do you need commercial support with SLA? Please check our support products <a href='https://jsreport.net/buy/support'>here</a>.<br>
<br>
Please download and read the end user license agreement:<br>
<a href='http://jsreport.net/terms-of-use-commercial.txt'>http://jsreport.net/terms-of-use-commercial.txt</a><br>
<br>
Thank you<br>
jsreport team
`,
      },
    },
    support: {
      us: {
        subject: 'New sale ${product.name}',
        content: `\${customer.email}<br><a href='https://jsreport.net/payments/customer/\${customer.uuid}'>https://jsreport.net/payments/customer/\${customer.uuid}</a>`,
      },
      customer: {
        subject: 'You bought ${product.name}',
        content: `Hi,<br>
thank for purchasing the jsreport support.<br>
<br>
Please register to the support portal <a href='https://support.jsreport.net'>https://support.jsreport.net</a> and follow the instructions.<br>
<br>
You can also use email support@jsreport.net for support questions and incidents.<br>
However, the support portal is the preferred way to contact us.<br>
Please always mention your're support subscriber in case you decide to use the email.<br>
<br>
The invoice can be downloaded from your customer portal<br>
<a href='https://jsreport.net/payments/customer/\${customer.uuid}'>https://jsreport.net/payments/customer/\${customer.uuid}</a><br>
<br>
Thank you<br>
jsreport team
`,
      },
    },
    custom: {
      us: {
        subject: 'New sale ${product.name}',
        content: `\${customer.email}<br><a href='https://jsreport.net/payments/customer/\${customer.uuid}'>https://jsreport.net/payments/customer/\${customer.uuid}</a>`,
      },
      customer: {
        subject: 'You bought ${product.name}',
        content: `Hi,<br>
thank you for purchasing \${product.name}.<br>
<br>
Please wait until our support team process your purchase. We will contact you shortly.
<br>
The invoice can be downloaded from your customer portal<br>
<a href='https://jsreport.net/payments/customer/\${customer.uuid}'>https://jsreport.net/payments/customer/\${customer.uuid}</a><br>
Thank you<br>
jsreport team
`,
      },
    }
  },
  cancel: {
    enterprise: {
      us: {
        subject: '${product.name} canceled',
        content: `\${customer.email}<br><a href='https://jsreport.net/payments/customer/\${customer.uuid}'>https://jsreport.net/payments/customer/\${customer.uuid}</a>`,
      },
      customer: {
        subject: '${product.name} canceled',
        content: `Hi,<br>
your \${product.name} has been canceled.<br>
You can continue using the license key until the end of the period.<br>
Since then the license key becomes invalid and server instances using it won't start.<br>
<br>
jsreport team
`,
      },
    },
    custom: {
      us: {
        subject: '${product.name} canceled',
        content: `\${customer.email}<br><a href='https://jsreport.net/payments/customer/\${customer.uuid}'>https://jsreport.net/payments/customer/\${customer.uuid}</a>`,
      },
      customer: {
        subject: '${product.name} canceled',
        content: `Hi,<br>
your \${product.name} has been canceled.<br>
<br>
jsreport team
`,
      },
    },
  },
  recurring: {
    us: {
      subject: '${product.name} successful recurring charge',
      content: `\${customer.email}<br><a href='https://jsreport.net/payments/customer/\${customer.uuid}'>https://jsreport.net/payments/customer/\${customer.uuid}</a>`,
    },
    customer: {
      subject: '${product.name} renewal successful',
      content: `Hi,<br>
your \${product.name} was successfuly renewed.<br>
<br>
The invoice can be downloaded from your customer portal <br>
<a href='https://jsreport.net/payments/customer/\${customer.uuid}'>https://jsreport.net/payments/customer/\${customer.uuid}</a><br>
<br>
Thank you for using jsreport<br>
jsreport team`,
    },
  },
  recurringFail: {
    us: {
      subject: '${product.name} renewal payment unsuccessful',
      content: `\${customer.email}<br><a href='https://jsreport.net/payments/customer/\${customer.uuid}'>https://jsreport.net/payments/customer/\${customer.uuid}</a>`,
    },
    customer: {
      subject: '${product.name} renewal payment unsuccessful',
      content: `Hi,<br>
we weren't able to charge your bank card for \${product.name} renewal.<br>
<br>
Please verify your bank credentials.<br>
<a href='https://jsreport.net/payments/customer/\${customer.uuid}/product/\${product.id}'>https://jsreport.net/payments/customer/\${customer.uuid}/product/\${product.id}</a><br>
<br>

jsreport team`,
    },
  },
  recurringCancel: {
    us: {
      subject: '${product.name} was canceled because of failed payments',
      content: `\${customer.email}<br><a href='https://jsreport.net/payments/customer/\${customer.uuid}'>https://jsreport.net/payments/customer/\${customer.uuid}</a>`,
    },
    customer: {
      subject: '${product.name} was canceled because of failed payments',
      content: `Hi,<br>
\${product.name} was canceled because of multiple failed payments.<br>
<br>
jsreport team`,
    },
  },
  customerLink: {
    subject: 'jsreport customer dashboard link',
    content: `Hi,<br/>        
you requested link to your jsreport customer dashboard. Here it is<br/><br/>
<a href='https://jsreport.net/payments/customer/\${customer.uuid}'>https://jsreport.net/payments/customer/\${customer.uuid}</a><br/>
<br/>
jsreport team
        `,
  },
  emailVerification: {
    subject: 'jsreport email verification',
    content: `Hi,<br/>        
please continue the purchase here<br/><br/>
<a href='https://jsreport.net/payments/customer/\${customer.uuid}/checkout/\${productCode}'>https://jsreport.net/payments/customer/\${customer.uuid}/checkout/\${productCode}</a><br/>
<br/>
jsreport team
        `,
  },
}
