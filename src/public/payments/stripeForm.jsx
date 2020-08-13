import React, { useState, useEffect } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { fetchPaymentIntentSecret, createSubscription } from './stripeForm.js'

const promise = loadStripe('pk_test_51H9xJkB3Af4o8hjcsukE4QyzIl5hvMwd82LTl68xKEh7uhcAIQuwVpSJi6kfVTCwkiJNzydjiHncRI87mTEygx2B00yA6rFrDL')
export default function StripeForm({ amount, onSubmit, email, product, vatApplied }) {
  return (
    <Elements stripe={promise}>
      <CardForm amount={amount} onSubmit={onSubmit} email={email} product={product} vatApplied={vatApplied} />
    </Elements>
  )
}

function CardForm({ amount, onSubmit, email, product, vatApplied }) {
  const [succeeded, setSucceeded] = useState(false)
  const [error, setError] = useState(null)
  const [processing, setProcessing] = useState('')
  const [disabled, setDisabled] = useState(true)
  const [clientSecret, setClientSecret] = useState('')
  const stripe = useStripe()
  const elements = useElements()
  useEffect(() => {
    if (product.isSubscription) {
      return
    }
    fetchPaymentIntentSecret(email, amount).then(setClientSecret)
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

  const handleSubscription = async () => {
    try {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement),
      })

      if (error) {
        throw new Error(error.message)
      }

      const subscription = await createSubscription({
        email,
        productName: product.name,
        vatApplied: vatApplied,
        paymentMethodId: paymentMethod.id,
      })

      const paymentIntent = subscription.latest_invoice.payment_intent

      if (subscription.status !== 'active') {
        if (paymentIntent.status === 'requires_payment_method') {
          throw new Error('Your card was declined')
        }

        if (paymentIntent.status === 'requires_action') {
          const { confirmedPaymentIntent, error } = await stripe.confirmCardPayment(paymentIntent.client_secret, {
            payment_method: paymentMethodId,
          })

          if (error) {
            throw new Error(error.message)
          }

          if (confirmedPaymentIntent.status !== 'succeeded') {
            throw new Error('Unexpected error, payment is in state ' + confirmedPaymentIntent.status)
          }
        }
      }

      setError(null)
      setProcessing(false)
      setSucceeded(true)
      return onSubmit({
        paymentIntentId: paymentIntent.id,
        subscriptionId: subscription.id,
      })
    } catch (e) {
      console.error(e)
      setError(`Subscription creation failed ${e}`)
      setProcessing(false)
      return
    }
  }

  const handleOneTime = async () => {
    try {
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
      onSubmit({ paymentIntentId: paymentIntent.id })
    } catch (e) {
      setError(`Payment failed ${e.message}`)
      setProcessing(false)
    }
  }

  const handleSubmit = async (ev) => {
    ev.preventDefault()
    setProcessing(true)

    if (product.isSubscription) {
      handleSubscription()
    } else {
      handleOneTime()
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
