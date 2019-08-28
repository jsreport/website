// SE817603255801
// CZ05821916
/* global braintree, countries */
/* eslint no-unused-vars: "off" */

import countries from './countries'
import products from './products'

export async function getUserCountry () {
  const res = await window.fetch('https://geoip-db.com/json/')
  const data = await res.json()
  return data.country_code
}

export async function validateVAT (vatNumber) {
  if (vatNumber == null) {
    return false
  }

  try {
    const r = await window.fetch('/api/validate-vat', {
      method: 'POST',
      body: JSON.stringify({ vatNumber }),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const data = await r.json()

    if (data.error || data.valid === false) {
      return false
    } else {
      return data
    }
  } catch (e) {
    return false
  }
}

export function calculatePrice ({ price, country, isVATValid }) {
  function round (value) {
    return Number(Math.round(value + 'e' + 2) + 'e-' + 2)
  }

  function getVatRate () {
    if (country === 'CZ') {
      return 21
    }

    return (countries.find(c => c.code === country).eu && !isVATValid) ? 21 : 0
  }

  const vatRate = getVatRate()
  const vatAmount = round(vatRate * 0.01 * price)
  return {
    vatRate,
    vatAmount,
    amount: vatAmount + price
  }
}

let braintreeInstance
export async function proceedToCardPayment () {
  const token = await window.fetch('/api/braintree-token').then((res) => res.text())
  braintreeInstance = await braintree.dropin.create({
    authorization: token,
    container: '#dropin-container'
  })
}

export async function submitCheckout ({
  price,
  amount,
  vatRate,
  vatAmount,
  email,
  currency,
  product,
  customer
}) {
  const paymentMethod = await braintreeInstance.requestPaymentMethod()
  const checkoutRes = await window.fetch('/api/checkout', {
    method: 'POST',
    body: JSON.stringify({
      price,
      amount,
      vatRate,
      vatAmount,
      email,
      nonce: paymentMethod.nonce,
      product: product,
      customer,
      currency,
      isEU: countries.find(c => c.code === customer.country).eu
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  })

  const checkoutData = await checkoutRes.json()
  window.location = '/customer/' + checkoutData.uuid
}
