import React, { useState, useEffect } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import Spinner from './spinner'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'

async function fetchPaymentIntentSecret(customerId, amount, setupIntent) { 
  const res = await window.fetch('/api/payments/' + (setupIntent ? 'setup-intent' : 'payment-intent'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ amount, customerId }),
  })

  const resData = await res.json()
  
  if (!res.ok) {
    throw new Error(resData && resData.error ? resData.error : res.statusText)
  }
  
  return resData.intent
}

const promise = window
  .fetch('/api/payments/stripe/client-secret', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  .then((r) => r.text())
  .then((c) => loadStripe(c))
  .catch(console.error)

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
  const [loadError, setLoadError] = useState(null)
  const [processing, setProcessing] = useState('')
  const [disabled, setDisabled] = useState(true)
  const [clientSecret, setClientSecret] = useState('')
  const stripe = useStripe()
  const elements = useElements()
  useEffect(() => {
    fetchPaymentIntentSecret(customerId, amount, setupIntent)
      .then((r) =>setClientSecret(r))
      .catch((e) => setLoadError(e.message))
  }, [customerId, amount, setupIntent])

  const cardStyle = {
    style: {
      base: {
        color: '#000000',
        fontWeight: 400,
        fontFamily: 'Segoe UI_,Open Sans,Verdana,Arial,Helvetica,sans-serif',
        fontSize: '16px',
        fontSmoothing: 'antialiased',
        '::placeholder': {
          color: '#000000',
        },
        ':-webkit-autofill': {
          color: '#000000',
        },
      },
      invalid: {
        color: '#E25950',

        '::placeholder': {
          color: '#FFCCA5',
        },
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

        await onSubmit(setupIntent)
        setError(null)
        setProcessing(false)
        setSucceeded(true)
      } else  {      
        const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: elements.getElement(CardElement),
          },
        })

        if (error) {
          throw new Error(error.message)
        }
      
        await onSubmit(paymentIntent)
        
        setError(null)
        setProcessing(false)
        setSucceeded(true)
      }
    } catch (e) {
      setError(`Payment failed ${e.message}`)
      setProcessing(false)
    }
  }

  if (loadError) {
    return <div className="row text-center">
        We were unable to initialize the payment form. Please reload and try again.
        error: {loadError}
    </div>
  }
  return (    
    <form id="payment-form" onSubmit={handleSubmit}>        
      <div className="row text-center">
        <div className="coll2">
          <CardElement id="card-element" options={cardStyle} onChange={handleChange} />
        </div>
      </div>

      {processing ? (
        <div className="row text-center">
          <div className="coll2">
            <Spinner loading={processing} />
          </div>
        </div>
      ) : (
        <></>
      )}

      <div className="row text-center">
        <div className="coll2">
          <button disabled={processing || disabled || succeeded} className="button success">
            Confirm
          </button>
        </div>
      </div>

      {error && (
        <div className="row text-center card-error">
          <div className="coll2">{error}</div>
        </div>
      )}
    </form>
  )
}
