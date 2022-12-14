import '@babel/polyfill'
import React from 'react'
import countries from './countries.js'
import Vat from './vat'
import StripeForm from './stripeForm'
import { getUserCountry, calculatePrice, product, plan, currency, currencyChar, price } from './customerCheckout.js'

function Country ({ value, onChange, disabled }) {
  return (
    <div className='coll2'>
      <label>Country</label>
      <small>
        <select className='fg-gray' onChange={onChange} required value={value} disabled={disabled}>
          {countries.map((c) => (
            <option key={c.code} value={c.code}>
              {c.name}
            </option>
          ))}
        </select>
      </small>
    </div>
  )
}

function Name ({ value, onChange }) {
  return (
    <div className='coll2'>
      <label>Company name (or personal name)</label>
      <small>
        <input className='fg-gray' type='text' id='companyName' size='30' required value={value} onChange={onChange} />
      </small>
    </div>
  )
}

function Address ({ value, onChange }) {
  return (
    <div className='coll2'>
      <label>Address</label>
      <small>
        <input className='fg-gray' type='text' id='companyAddress' size='40' required value={value} onChange={onChange} />
      </small>
    </div>
  )
}

function PaymentCycles ({ plan, paymentCycle, onChange, disabled }) {
  return (
    <>
      <div className='row'>
        <div className='fg-gray'>
          <h3>PAYMENT CYCLE</h3>
        </div>
      </div>
      <div className='row'>
        <table className='table' style={{ width: '30%', margin: '0 auto' }}>
          <tbody>
            <tr style={{ cursor: 'pointer' }} onClick={() => !disabled && onChange('monthly')} className={`bg-hover-cyan fg-hover-white ${paymentCycle === 'monthly' ? 'bg-cyan fg-white' : 'bg-grayLighter'}`}>
              <td>monthly</td>
              <td style={{ textAlign: 'right' }}>{plan.paymentCycles.monthly.price[currency]}{currencyChar}</td>
            </tr>
            <tr style={{ cursor: 'pointer' }} onClick={() => !disabled && onChange('yearly')} className={`bg-hover-cyan fg-hover-white ${paymentCycle === 'yearly' ? 'bg-cyan fg-white' : 'bg-grayLighter '}`}>
              <td>yearly</td>
              <td style={{ textAlign: 'right' }}>{plan.paymentCycles.yearly.price[currency]}{currencyChar}<br />(2 months free)</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  )
}

class CustomerCheckout extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      country: 'US',
      address: '',
      vatNumber: '',
      name: '',
      isVATValid: null,
      paymentCycle: 'yearly'
    }
    this.paymentForm = React.createRef()
  }

  componentDidMount () {
    getUserCountry()
      .then((r) => this.setState({ country: r }))
      .catch(console.error.bind(console))
  }

  proceedCardDetails () {
    if (!this.paymentForm.current.checkValidity()) {
      this.paymentForm.current.reportValidity()
      return
    }

    this.setState({
      cardDetailsVisible: true
    })
  }

  async submitCheckout (paymentIntent) {
    const { vatRate, vatAmount, amount } = calculatePrice({
      product: this.props.match.params.product,
      plan: this.props.match.params.plan,
      country: this.state.country,
      isVATValid: this.state.isVATValid && this.state.vatNumber,
      paymentCycle: this.state.paymentCycle
    })

    const country = countries.find((c) => c.code === this.state.country)
    const checkoutRes = await window.fetch('/api/payments/checkout', {
      method: 'POST',
      body: JSON.stringify({
        price: price(this.props.match.params.product, this.props.match.params.plan, this.state.paymentCycle),
        amount,
        vatRate,
        vatAmount,
        customerId: this.props.match.params.customer,
        productCode: this.props.match.params.product,
        planCode: this.props.match.params.plan,
        name: this.state.name,
        address: this.state.address,
        country: country.name,
        vatNumber: this.state.vatNumber,
        currency,
        isEU: country.eu,
        paymentIntentId: paymentIntent.id,
        paymentCycle: this.state.paymentCycle
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const resData = await checkoutRes.json()

    if (!checkoutRes.ok) {
      throw new Error(resData && resData.error ? resData.error : checkoutRes.statusText)
    }

    this.props.history.push(`/payments/customer/${this.props.match.params.customer}/product/${resData.id}`)
  }

  render () {
    const mproduct = product(this.props.match.params.product, this.props.match.params.plan)
    const mplan = plan(this.props.match.params.product, this.props.match.params.plan)

    const calculatedPrice = calculatePrice({
      product: this.props.match.params.product,
      plan: this.props.match.params.plan,
      country: this.state.country,
      isVATValid: this.state.isVATValid && this.state.vatNumber,
      paymentCycle: this.state.paymentCycle
    })

    return (
      <div>
        <div className='section bg-darkCyan'>
          <div className='text-center'>
            <h2 className='fg-white buy-title'>{mproduct.name}</h2>
            <small className='fg-grayLighter'>{mproduct.infoLine}</small>
            {mplan ? <><h2 className='fg-grayLighter'>{mplan.name} plan</h2><small className='fg-grayLighter'>{mplan.infoLine}</small></> : <></>}
          </div>
        </div>
        <div className='grid text-center container small section'>
          <div className='row'>
            <div className='fg-gray'>
              <h3>BILLING INFORMATION</h3>
            </div>
          </div>
          <form ref={this.paymentForm} className='fg-gray text-center'>
            <div className='row'>
              <Vat
                disabled={this.state.cardDetailsVisible}
                value={this.state.vatNumber}
                onChange={(v) => this.setState({ vatNumber: v.target.value })}
                onVATValidated={(r) => {
                  if (!r.isValid) {
                    return this.setState({
                      isVATValid: false
                    })
                  }

                  this.setState({
                    isVATValid: true,
                    address: r.value.address,
                    country: r.value.country,
                    name: r.value.name
                  })
                }}
              />
              <Country disabled={this.state.cardDetailsVisible} value={this.state.country} onChange={(v) => this.setState({ country: v.target.value })} />
            </div>
            <div className='row'>
              <Name value={this.state.name} onChange={(v) => this.setState({ name: v.target.value })} />
              <Address value={this.state.address} onChange={(v) => this.setState({ address: v.target.value })} />
            </div>
            {mplan && mplan.paymentCycles
              ? <PaymentCycles
                  plan={mplan}
                  paymentCycle={this.state.paymentCycle}
                  onChange={(v) => this.setState({ paymentCycle: v })}
                  disabled={this.state.cardDetailsVisible}
                />
              : <div />}

            <div className='row'>
              <hr />
            </div>
            <div className='row'>
              <div className='coll3'>
                <label>Price</label>
                <h3>{price(this.props.match.params.product, this.props.match.params.plan, this.state.paymentCycle) + currencyChar}</h3>
              </div>
              <div className='coll3'>
                <label>VAT {calculatedPrice.vatRate + '%'}</label>
                <h3>{calculatedPrice.vatAmount + currencyChar}</h3>
              </div>
              <div className='coll3'>
                <div className='spinner' id='spinner' />
                <label>Amount to pay</label>
                <h3>{calculatedPrice.amount + currencyChar}</h3>
              </div>
            </div>
          </form>
          {!this.state.cardDetailsVisible
            ? (
              <div className='row' onClick={() => this.proceedCardDetails()}>
                <a className='button text-center bg-green bg-hover-gray btn'>
                  <span className='fg-white'>Proceed to card details</span>
                </a>
              </div>
              )
            : (
              <StripeForm
                amount={calculatedPrice.amount}
                customerId={this.props.match.params.customer}
                onSubmit={(p, s) => this.submitCheckout(p, s)}
              />
              )}
          <div className='row'>
            <div className='fg-gray'>
              <small>Do you have a problem with the purchase or want to ask something? Please contact us at sales@jsreport.net</small>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default CustomerCheckout
