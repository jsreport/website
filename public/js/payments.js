// SE817603255801
// CZ05821916
/* global braintree, countries */
/* eslint no-unused-vars: "off" */

const products = {
  enterprise: {
    name: 'jsreport enterprise license',
    price: {
      usd: 645
    },
    permalink: 'SBwu'
  },
  enterpriseScale: {
    name: 'jsreport enterprise scale license',
    price: {
      usd: 1995
    },
    permalink: 'SBwu'
  },
  enterpriseSubscription: {
    name: 'jsreport enterprise subscription',
    prices: {
      usd: 295
    },
    isSubscription: true,
    permalink: 'SBwu'
  }
}

const product = 'enterprise'
const currency = 'usd'

let _vatNumber
const vatNumber = () => _vatNumber

const country = () => countries.find(c => c.code === document.getElementById('country').value)
const vatRate = () => {
  if (country().code === 'CZ') {
    return 21
  }

  return (country().eu && vatNumber() == null) ? 21 : 0
}

const price = () => products[product].price[currency]
const vatAmount = () => round(vatRate() * 0.01 * products[product].price[currency])
const amount = () => round(vatAmount() + price())

const countryEl = document.getElementById('country')
countries.forEach(c => {
  const opt = document.createElement('option')
  opt.value = c.code
  opt.innerHTML = c.name
  countryEl.appendChild(opt)
})

function fillFormPrices () {
  const currencyChar = currency === 'usd' ? '$' : '€'
  document.getElementById('licensePrice').innerText = price() + ' ' + currencyChar
  document.getElementById('vatAmount').innerText = vatAmount() + ' ' + currencyChar
  document.getElementById('amount').innerText = amount() + ' ' + currencyChar
}

function countryChanged () {
  fillFormPrices()
}

function validateVAT () {
  const vatNumberValue = document.getElementById('vatNumber').value.trim()

  if (!vatNumberValue) {
    _vatNumber = null
    fillFormPrices()
    return
  }

  window.fetch('/api/validate-vat', {
    method: 'POST',
    body: JSON.stringify({ vatNumber: vatNumberValue }),
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then((r) => r.json())
    .then((r) => {
      if (r.error || r.valid === false) {
        document.getElementById('errorVAT').innerText = (r.error || 'Invalid VAT number.') + ' It won\'t be used!'
        document.getElementById('errorVAT').style.display = 'inline'
        _vatNumber = null
      } else {
        document.getElementById('companyName').value = r.name
        document.getElementById('companyAddress').value = r.address
        document.getElementById('country').value = r.countryCode
        document.getElementById('errorVAT').style.display = 'none'
        _vatNumber = vatNumberValue
      }
      fillFormPrices()
    })
    .catch((e) => console.error(e))
}

function vatTypying () {
  document.getElementById('errorVAT').style.display = 'none'
}

function proceedCardDetails () {
  if (!document.getElementById('paymentForm').checkValidity()) {
    document.getElementById('paymentForm').reportValidity()
    return
  }

  document.getElementById('proceedCardDetailsBox').style.display = 'none'
  document.getElementById('braintreeBox').style.display = 'block'

  window.fetch('/api/braintree-token')
    .then((res) => res.text())
    .then((token) => braintree.dropin.create({
      authorization: token,
      container: '#dropin-container'
    }))
    .then((braintreeInstance) => {
      document.getElementById('spinner').style.display = 'none'
      document.getElementById('submitCheckout').style.display = 'block'
      document.getElementById('submitCheckout').addEventListener('click', () => {
        braintreeInstance.requestPaymentMethod((requestPaymentMethodErr, payload) => {
          if (!document.getElementById('paymentForm').checkValidity()) {
            document.getElementById('paymentForm').reportValidity()
            return
          }

          window.fetch('/api/checkout', {
            method: 'POST',
            body: JSON.stringify({
              price: price(),
              amount: amount(),
              vatRate: vatRate(),
              vatAmount: vatAmount(),
              email: document.getElementById('email').value.trim(),
              nonce: payload.nonce,
              product: products[product],
              customer: {
                countryCode: document.getElementById('country').value.trim(),
                country: countries.find(c => c.code === document.getElementById('country').value.trim()).name,
                vatNumber: document.getElementById('vatNumber').value.trim(),
                name: document.getElementById('companyName').value.trim(),
                address: document.getElementById('companyAddress').value.trim()
              },
              currency,
              isEU: country().eu
            }),
            headers: {
              'Content-Type': 'application/json'
            }
          }).then((r) => r.json()).then((r) => {
            if (r.error) {
              throw new Error(r.error)
            }

            window.location = '/customer/' + r.uuid
          })
        })
      })
    }).catch((e) => console.error(e))
}

window.fetch('https://geoip-db.com/json/').then(r => r.json()).then((ip) => {
  countryEl.value = ip.country_code
  fillFormPrices()
}).catch(console.error.bind(console))

function round (value) {
  return Number(Math.round(value + 'e' + 2) + 'e-' + 2)
}

fillFormPrices()
