import '@babel/polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import products from './products.js'
import countries from './countries.js'
import { getUserCountry, validateVAT, proceedToCardPayment, calculatePrice, submitCheckout } from './checkout.js'

const product = 'enterprise'
const currency = 'usd'
const currencyChar = currency === 'usd' ? '$' : '€'

function Email ({ value, onChange }) {
  return (
    <div className='span4'>
      <label>Email</label>
      <small>
        <input className='fg-gray' type='email' size='30' required value={value} onChange={onChange} />
      </small>
    </div>
  )
}

function Vat ({ value, onChange, validate, typing, isVATValid }) {
  return (
    <div className='span4'>
      <label>VAT number (optional)</label>
      <small>
        <input className='fg-gray' type='text' size='30' onChange={onChange} onBlur={validate} onKeyPress={typing} value={value} />
      </small>
      <div>
        {isVATValid !== false || !value ? <span /> : <small><label id='errorVAT' style={{ color: 'red' }}>The VAT number isn't valid and won't be used</label></small>}
      </div>
    </div>
  )
}

function Country ({ value, onChange }) {
  return (
    <div className='span4'>
      <label>Country</label>
      <small>
        <select className='fg-gray' onChange={onChange} required value={value}>
          {countries.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
        </select>
      </small>
    </div>
  )
}

function Name ({ value, onChange }) {
  return (
    <div className='span4'>
      <label>Company name (or personal name)</label>
      <small>
        <input className='fg-gray' type='text' id='companyName' size='30' required value={value} onChange={onChange} />
      </small>
    </div>
  )
}

function Address ({ value, onChange }) {
  return (
    <div className='span8'>
      <label>Address</label>
      <small>
        <input className='fg-gray' type='text' id='companyAddress' size='40' required value={value} onChange={onChange} />
      </small>
    </div>
  )
}

class Checkout extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      country: 'US',
      address: '',
      email: '',
      vatNumber: '',
      name: '',
      isVATValid: null
    }
  }

  componentDidMount () {
    getUserCountry().then(r => this.setState({ country: r })).catch(console.error.bind(console))
  }

  validateVAT () {
    validateVAT(this.state.vatNumber).then((r) => {
      if (r === false) {
        this.setState({
          isVATValid: false
        })
      } else {
        this.setState({
          isVATValid: true,
          name: r.name,
          address: r.address,
          country: r.country
        })
      }
    }).catch(console.error.bind(console))
  }

  vatTypying () {
  }

  proceedCardDetails () {
    if (!this.refs.paymentForm.checkValidity()) {
      this.refs.paymentForm.reportValidity()
      return
    }

    this.setState({
      cardDetailsVisible: true
    })
    proceedToCardPayment().then(() => this.setState({
      braintreeLoaded: true
    }))
  }

  submitCheckout () {
    if (!this.refs.paymentForm.checkValidity()) {
      this.refs.paymentForm.reportValidity()
    }

    const { vatRate, vatAmount, amount } = calculatePrice({
      price: products[product].price[currency],
      country: this.state.country,
      isVATValid: this.state.isVATValid
    })

    submitCheckout({
      amount,
      vatRate,
      vatAmount,
      email: this.state.email,
      price: products[product].price[currency],
      product: products[product],
      currency,
      customer: {
        name: this.state.name,
        address: this.state.address,
        country: this.state.country,
        vatNumber: this.vatNumber
      }
    })
  }

  render () {
    const calculatedPrice = calculatePrice({
      price: products[product].price[currency],
      country: this.state.country,
      isVATValid: this.state.isVATValid
    })

    return (
      <form ref='paymentForm'>
        <div className='grid fg-gray'>
          <div className='row'>
            <Email value={this.state.email} onChange={(v) => this.setState({ email: v.target.value })} />
            <Vat
              value={this.state.vatNumber}
              isVATValid={this.state.isVATValid}
              validate={() => this.validateVAT()}
              typing={() => this.vatTypying()}
              onChange={(v) => this.setState({ vatNumber: v.target.value })}
            />
            <Country value={this.state.country} onChange={(v) => this.setState({ country: v.target.value })} />
          </div>
          <div className='row'>
            <Name value={this.state.name} onChange={(v) => this.setState({ name: v.target.value })} />
            <Address value={this.state.address} onChange={(v) => this.setState({ address: v.target.value })} />
          </div>
        </div>
        <div className='row'>
          <hr />
        </div>
        <div className='row'>
          <div className='span4'>
            <label>License price</label>
            <h3>{products[product].price[currency] + currencyChar}</h3>
          </div>
          <div className='span4'>
            <label>VAT {calculatedPrice.vatRate + '%'}</label>
            <h3>{calculatedPrice.vatAmount + currencyChar}</h3>
          </div>
          <div className='span4'>
            <label>Amount to pay</label>
            <h3>{calculatedPrice.amount + currencyChar}</h3>
          </div>
        </div>
        {!this.state.cardDetailsVisible
          ? (
            <div onClick={() => this.proceedCardDetails()}>
              <a className='button text-center bg-green bg-hover-gray btn'>
                <span className='fg-white'>Proceed to card details</span>
              </a>
            </div>
          )
          : (
            <div id='braintreeBox'>
              {this.state.braintreeLoaded ? <span /> : <i className='icon-spin fg-gray' id='spinner' style={{ animation: 'spin 1s linear infinite' }} />}
              <div id='dropin-container' />
              <div>
                {this.state.braintreeLoaded ? (
                  <a onClick={() => this.submitCheckout()} className='button text-center bg-green bg-hover-gray btn'>
                    <span className='fg-white'>Submit checkout</span>
                  </a>
                ) : <span />}

              </div>
            </div>
          )}
      </form>
    )
  }
}

ReactDOM.render(<Checkout />, document.getElementById('root'))
