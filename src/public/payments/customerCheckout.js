// SE817603255801
// CZ05821916
/* global countries */
/* eslint no-unused-vars: "off" */

import countries from './countries'
import products from '../../shared/products'

export async function getUserCountry () {
  const res = await window.fetch('https://geoip-db.com/json/')
  const data = await res.json()
  return data.country_code
}

export async function validateVAT (vatNumber) {
  if (vatNumber == null) {
    return {
      isValid: false
    }
  }

  try {
    const r = await window.fetch('/api/payments/validate-vat', {
      method: 'POST',
      body: JSON.stringify({ vatNumber }),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const data = await r.json()

    if (data.error || data.valid === false) {
      return {
        isValid: false
      }
    } else {
      return {
        isValid: true,
        value: data
      }
    }
  } catch (e) {
    return {
      isValid: false
    }
  }
}

export const product = (productCode) => products[productCode]
export const plan = (productCode, planCode) => (products[productCode].plans || {})[planCode]
export const planOrProduct = (productCode, planCode) => plan(productCode, planCode) || product(productCode, planCode)

export const currency = 'usd'
export const currencyChar = '$'
export const price = (productCode, planCode, paymentCycle) => {
  const p = planOrProduct(productCode, planCode)
  if (!p.paymentCycles) {
    return p.price[currency]
  }

  return p.paymentCycles[paymentCycle].price[currency]
}

export function calculatePrice ({ product, plan, country, isVATValid, paymentCycle }) {
  function round (value) {
    return Number(Math.round(value + 'e' + 2) + 'e-' + 2)
  }

  function getVatRate () {
    if (country === 'CZ') {
      return 21
    }

    return countries.find((c) => c.code === country).eu && !isVATValid ? 21 : 0
  }

  const vatRate = getVatRate()
  const vatAmount = round(vatRate * 0.01 * price(product, plan, paymentCycle))
  return {
    vatRate,
    vatAmount,
    amount: vatAmount + price(product, plan, paymentCycle)
  }
}
