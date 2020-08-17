import '@babel/polyfill'
import React, { useState, useRef } from 'react'
import products from './products'

export default function (props) {
  const productCode = props.match.params.product
  const [email, setEmail] = useState('')
  const [pending, setPending] = useState(true)
  const form = useRef(null)

  async function verifyEmail(e) {
    e.preventDefault()

    if (!form.current.checkValidity()) {
      form.current.reportValidity()
      return
    }

    try {
      const r = await window.fetch('/api/payments/email-verification', {
        method: 'POST',
        body: JSON.stringify({ email, productCode }),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const text = await r.text()
      if (!r.ok) {
        throw new Error(text)
      }
      setPending(false)
    } catch (e) {
      alert(e.message)
    }
  }

  return (
    <div>
      <div className="section bg-darkCyan text-center">
        <h2 className="fg-white buy-title">{products[productCode].name}</h2>
        <small className="fg-grayLighter">{products[productCode].infoLine}</small>
      </div>
      <form ref={form} onSubmit={() => this.verifyEmail(e)}>
        <div className="grid container small section">
          <div className="row text-center">
            <div>
              <h3>EMAIL</h3>
              <small>
                <p>Please fill your email, we send you confirmation email with link to the secure purchase.</p>
              </small>
            </div>
          </div>
          <div className="row text-center fg-gray">
            <small>
              <input type="email" size="40" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </small>
          </div>

          <div className="row text-center">
            {pending ? (
              <button className="button info" onClick={(e) => verifyEmail(e)}>
                Send verification email
              </button>
            ) : (
              <button className="button success">The verification email was sent...</button>
            )}
          </div>
        </div>
      </form>
    </div>
  )
}
