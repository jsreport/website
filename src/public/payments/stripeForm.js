export async function fetchPaymentIntentSecret(email, amount) {
  const res = await window.fetch('/api/payments/payment-intent', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ amount, email }),
  })
  const json = await res.json()
  return json.clientSecret
}

export async function createSubscription({ email, productName, paymentMethodId, vatApplied }) {
  const res = await window.fetch('/api/payments/subscription', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, productName, paymentMethodId, vatApplied }),
  })

  const json = await res.json()

  if (res.ok) {
    return json
  }

  throw new Error('Failed to create subscription on the server: ' + json.error)
}
