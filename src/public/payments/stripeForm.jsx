import React, { useState, useEffect } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'

async function fetchPaymentIntentSecret(customerId, amount, setupIntent) {
  const res = await window.fetch('/api/payments/' + (setupIntent ? 'setup-intent' : 'payment-intent'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ amount, customerId }),
  })
  return res.text()
}

const promise = loadStripe('pk_test_51H9xJkB3Af4o8hjcsukE4QyzIl5hvMwd82LTl68xKEh7uhcAIQuwVpSJi6kfVTCwkiJNzydjiHncRI87mTEygx2B00yA6rFrDL')
export default function StripeForm({ amount, onSubmit, customerId, product, setupIntent }) {
  return (
    <Elements stripe={promise}>
      <CardForm amount={amount} onSubmit={onSubmit} customerId={customerId} product={product} setupIntent={setupIntent} />
    </Elements>
  )
}

function CardForm({ amount, onSubmit, customerId, product, setupIntent }) {
  const [succeeded, setSucceeded] = useState(false)
  const [error, setError] = useState(null)
  const [processing, setProcessing] = useState('')
  const [disabled, setDisabled] = useState(true)
  const [clientSecret, setClientSecret] = useState('')
  const stripe = useStripe()
  const elements = useElements()
  useEffect(() => {
    fetchPaymentIntentSecret(customerId, amount, setupIntent).then(setClientSecret)
  }, [])

  const cardStyle = {
    style: {
      base: {
        color: '#32325d',
        fontFamily: 'Arial, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
          color: '#32325d',
        },
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a',
      },
    },
  }

  const handleChange = async (event) => {
    // Listen for changes in the CardElement
    // and display any errors as the customer types their card details
    setDisabled(event.empty)
    setError(event.error ? event.error.message : '')
  }

  const handleSubmit = async (ev) => {
    ev.preventDefault()
    setProcessing(true)

    try {
      if (setupIntent) {
        const { error, setupIntent } = await stripe.confirmCardSetup(clientSecret, {
          payment_method: {
            card: elements.getElement(CardElement),
          },
        })

        if (error) {
          throw new Error(error.message)
        }

        setError(null)
        setProcessing(false)
        setSucceeded(true)
        return onSubmit(setupIntent)
      }

      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      })

      if (error) {
        throw new Error(error.message)
      }

      setError(null)
      setProcessing(false)
      setSucceeded(true)
      onSubmit(paymentIntent)
    } catch (e) {
      setError(`Payment failed ${e.message}`)
      setProcessing(false)
    }
  }

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <CardElement id="card-element" options={cardStyle} onChange={handleChange} />
      <button disabled={processing || disabled || succeeded} id="submit">
        <span id="button-text">{processing ? <div className="spinner" id="spinner" /> : 'Pay'}</span>
      </button>
      {/* Show any error that happens when processing the payment */}
      {error && (
        <div className="card-error" role="alert">
          {error}
        </div>
      )}
    </form>
  )
}
