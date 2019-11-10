import '@babel/polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import countries from './countries.js'
import Vat from './vat'
import Braintree from './braintree'
import { getUserCountry, calculatePrice, product, currency, currencyChar, price } from './checkout.js'

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

function Country ({ value, onChange }) {
  return (
    <div className='span4'>
      <label>Country</label>
      <small>
        <select className='fg-gray' onChange={onChange} required value={value}>
          {countries.map(c => (
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
    getUserCountry()
      .then(r => this.setState({ country: r }))
      .catch(console.error.bind(console))
  }

  proceedCardDetails () {
    if (!this.refs.paymentForm.checkValidity()) {
      this.refs.paymentForm.reportValidity()
      return
    }

    this.setState({
      cardDetailsVisible: true
    })
  }

  async submitCheckout (pm) {
    const { vatRate, vatAmount, amount } = calculatePrice({
      country: this.state.country,
      isVATValid: this.state.isVATValid
    })

    const country = countries.find(c => c.code === this.state.country)
    const checkoutRes = await window.fetch('/api/checkout', {
      method: 'POST',
      body: JSON.stringify({
        price: price(),
        amount,
        vatRate,
        vatAmount,
        email: this.state.email,
        nonce: pm.nonce,
        product: product(),
        name: this.state.name,
        address: this.state.address,
        country: country.name,
        vatNumber: this.state.vatNumber,
        currency,
        isEU: country.eu
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const resData = await checkoutRes.json()

    if (!checkoutRes.ok) {
      throw new Error(resData && resData.error ? resData.error : checkoutRes.statusText)
    }

    this.props.history.push(`/payments/customer/${resData.uuid}`)
  }

  render () {
    const calculatedPrice = calculatePrice({
      country: this.state.country,
      isVATValid: this.state.isVATValid
    })

    return (
      <div>
        <div className='section bg-darkCyan'>
          <div className='text-center'>
            <h2 className='fg-white buy-title'>{product().name}</h2>
            <small className='fg-grayLighter'>{product().infoLine}</small>
          </div>
        </div>
        <div className='grid container small section'>
          <div className='row text-center'>
            <div className='fg-gray'>
              <h3>BILLING INFORMATION</h3>
            </div>
          </div>
          <div className='row'>
            <form ref='paymentForm'>
              <div className='grid fg-gray'>
                <div className='row'>
                  <Email value={this.state.email} onChange={v => this.setState({ email: v.target.value })} />
                  <Vat
                    value={this.state.vatNumber}
                    onChange={v => this.setState({ vatNumber: v.target.value })}
                    onValidVAT={r =>
                      this.setState({
                        isVATValid: true,
                        address: r.address,
                        country: r.country,
                        name: r.name
                      })
                    }
                  />
                  <Country value={this.state.country} onChange={v => this.setState({ country: v.target.value })} />
                </div>
                <div className='row'>
                  <Name value={this.state.name} onChange={v => this.setState({ name: v.target.value })} />
                  <Address value={this.state.address} onChange={v => this.setState({ address: v.target.value })} />
                </div>
              </div>
              <div className='row'>
                <hr />
              </div>
              <div className='row'>
                <div className='span4'>
                  <label>License price</label>
                  <h3>{price() + currencyChar}</h3>
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
              {!this.state.cardDetailsVisible ? (
                <div className='row' onClick={() => this.proceedCardDetails()}>
                  <a className='button text-center bg-green bg-hover-gray btn'>
                    <span className='fg-white'>Proceed to card details</span>
                  </a>
                </div>
              ) : (
                <Braintree onSubmit={pm => this.submitCheckout(pm)} />
              )}
            </form>
          </div>
        </div>
      </div>
    )
  }
}

export default Checkout
