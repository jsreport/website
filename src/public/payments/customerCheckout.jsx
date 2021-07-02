import '@babel/polyfill'
import React from 'react'
import countries from './countries.js'
import Vat from './vat'
import StripeForm from './stripeForm'
import { getUserCountry, calculatePrice, product, currency, currencyChar, price } from './customerCheckout.js'

function Country({ value, onChange }) {
  return (
    <div className="coll2">
      <label>Country</label>
      <small>
        <select className="fg-gray" onChange={onChange} required value={value}>
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

function Name({ value, onChange }) {
  return (
    <div className="coll2">
      <label>Company name (or personal name)</label>
      <small>
        <input className="fg-gray" type="text" id="companyName" size="30" required value={value} onChange={onChange} />
      </small>
    </div>
  )
}

function Address({ value, onChange }) {
  return (
    <div className="coll2">
      <label>Address</label>
      <small>
        <input className="fg-gray" type="text" id="companyAddress" size="40" required value={value} onChange={onChange} />
      </small>
    </div>
  )
}

class CustomerCheckout extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      country: 'US',
      address: '',
      vatNumber: '',
      name: '',
      isVATValid: null,
    }
    this.paymentForm = React.createRef()
  }

  componentDidMount() {
    getUserCountry()
      .then((r) => this.setState({ country: r }))
      .catch(console.error.bind(console))
  }

  proceedCardDetails() {
    if (!this.paymentForm.current.checkValidity()) {
      this.paymentForm.current.reportValidity()
      return
    }

    this.setState({
      cardDetailsVisible: true,
    })
  }

  async submitCheckout(paymentIntent) {
    const { vatRate, vatAmount, amount } = calculatePrice({
      country: this.state.country,
      isVATValid: this.state.isVATValid && this.state.vatNumber,
    })

    const country = countries.find((c) => c.code === this.state.country)
    const checkoutRes = await window.fetch('/api/payments/checkout', {
      method: 'POST',
      body: JSON.stringify({
        price: price(),
        amount,
        vatRate,
        vatAmount,
        customerId: this.props.match.params.customer,
        product: product(),
        name: this.state.name,
        address: this.state.address,
        country: country.name,
        vatNumber: this.state.vatNumber,
        currency,
        isEU: country.eu,
        paymentIntentId: paymentIntent.id,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const resData = await checkoutRes.json()

    if (!checkoutRes.ok) {
      throw new Error(resData && resData.error ? resData.error : checkoutRes.statusText)
    }

    this.props.history.push(`/payments/customer/${resData.uuid}`)
  }

  render() {    
    const calculatedPrice = calculatePrice({
      country: this.state.country,
      isVATValid: this.state.isVATValid && this.state.vatNumber,
    })

    return (
      <div>
        <div className="section bg-darkCyan">
          <div className="text-center">
            <h2 className="fg-white buy-title">{product().name}</h2>
            <small className="fg-grayLighter">{product().infoLine}</small>
          </div>
        </div>
        <div className="grid text-center container small section">
          <div className="row">
            <div className="fg-gray">
              <h3>BILLING INFORMATION</h3>
            </div>
          </div>
          <form ref={this.paymentForm} className="fg-gray text-center">
            <div className="row">
              <Vat
                value={this.state.vatNumber}
                onChange={(v) => this.setState({ vatNumber: v.target.value })}
                onVATValidated={(r) => {
                  if (!r.isValid) {
                    return this.setState({
                      isVATValid: false,
                    })
                  }

                  this.setState({
                    isVATValid: true,
                    address: r.value.address,
                    country: r.value.country,
                    name: r.value.name,
                  })
                }}
              />
              <Country value={this.state.country} onChange={(v) => this.setState({ country: v.target.value })} />
            </div>
            <div className="row">
              <Name value={this.state.name} onChange={(v) => this.setState({ name: v.target.value })} />
              <Address value={this.state.address} onChange={(v) => this.setState({ address: v.target.value })} />
            </div>
            <div className="row">
              <hr />
            </div>
            <div className="row">
              <div className="coll3">
                <label>License price</label>
                <h3>{price() + currencyChar}</h3>
              </div>
              <div className="coll3">
                <label>VAT {calculatedPrice.vatRate + '%'}</label>
                <h3>{calculatedPrice.vatAmount + currencyChar}</h3>
              </div>
              <div className="coll3">
                <div className="spinner" id="spinner" />
                <label>Amount to pay</label>
                <h3>{calculatedPrice.amount + currencyChar}</h3>
              </div>
            </div>
          </form>
          {!this.state.cardDetailsVisible ? (
            <div className="row" onClick={() => this.proceedCardDetails()}>
              <a className="button text-center bg-green bg-hover-gray btn">
                <span className="fg-white">Proceed to card details</span>
              </a>
            </div>
          ) : (
            <StripeForm
              amount={calculatedPrice.amount}
              customerId={this.props.match.params.customer}
              product={product()}
              onSubmit={(p, s) => this.submitCheckout(p, s)}
            />
          )}
          <div className="row">
            <div className="fg-gray">
              <small>Do you have a problem with the purchase or want to ask something? Please contact us at sales@jsreport.net</small>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default CustomerCheckout
