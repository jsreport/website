import React from 'react'
import LicenseKey from './licenseKey'
import products from './products'
import Braintree from './braintree'

function loadCustomer (uuid) {
  return window.fetch(`/api/customer/${uuid}`).then(r => r.json())
}

function currencyChar (currency) {
  return currency === 'usd' ? '$' : '€'
}

function addYear (d) {
  d.setFullYear(d.getFullYear() + 1)
  return d
}

function Invoice ({ invoice, customerId }) {
  return (
    <div>
      <div>
        <a
          href={`/payments/customer/${customerId}/invoice/${invoice.data.invoiceId}`}
          target='_blank'
          className='text-center fg-cyan fg-hover-green'
          style={{ cursor: 'pointer' }}
        >
          <span className='padding5'>{invoice.data.invoiceId}</span>
          <span className='padding5'>{invoice.data.amount + currencyChar(invoice.data.currency)}</span>
          <i className='padding5 icon-download' />
        </a>
      </div>
    </div>
  )
}

export default class Product extends React.Component {
  constructor () {
    super()
    this.state = {}
  }

  componentDidMount () {
    this.load()
  }

  load () {
    loadCustomer(this.props.match.params.customer).then(c => {
      const product = c.products.find(p => p.id === this.props.match.params.product)
      this.setState({
        ...product,
        updating: false
      })
    })
  }

  async cancel () {
    if (!window.confirm('Are you sure you want to cancel this subscription?')) {
      return
    }

    try {
      const res = await window.fetch(`/api/customer/${this.props.match.params.customer}/subscription/${this.state.id}`, {
        method: 'DELETE'
      })

      const resJson = await res.json()

      if (!res.ok) {
        return alert(resJson.error)
      }

      this.setState({
        subscription: {
          ...this.state.subscription,
          state: 'canceled'
        }
      })
    } catch (e) {
      return alert(e.message)
    }
  }

  async updatePaymentMethod (pm) {
    try {
      const res = await window.fetch(`/api/customer/${this.props.match.params.customer}/subscription/${this.state.id}`, {
        method: 'PUT',
        body: JSON.stringify(pm),
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const resJson = await res.json()

      if (!res.ok) {
        return alert(resJson.error)
      }
    } catch (e) {
      return alert(e.message)
    }

    this.load()
  }

  renderSubscrption () {
    return (
      <React.Fragment>
        <div>
          <h3>SUBSCRIPTION</h3>
        </div>
        {this.state.subscription.state === 'active' ? (
          <div>
            <p>
              The next payment is planned on {addYear(new Date(this.state.braintree.subscription.nextBillingDate)).toLocaleDateString()}
              <br />
              The current used bank card is {this.state.braintree.paymentMethod.maskedNumber} expiring on {this.state.braintree.paymentMethod.expirationMonth}/
              {this.state.braintree.paymentMethod.expirationYear}
            </p>
            {!this.state.updating ? (
              <React.Fragment>
                <button className='button info' style={{ marginRight: '10px' }} onClick={() => this.setState({ updating: true })}>
                  Update bank card
                </button>
                <button className='button danger' onClick={() => this.cancel()}>
                  Cancel
                </button>
              </React.Fragment>
            ) : (
              <React.Fragment />
            )}
            {this.state.updating ? <Braintree onSubmit={pm => this.updatePaymentMethod(pm)} /> : <React.Fragment />}
          </div>
        ) : (
          <div>
            <span className='bg-red fg-white' style={{ padding: '3px' }}>
              Canceled
            </span>
          </div>
        )}
      </React.Fragment>
    )
  }

  renderOneTime () {
    return <React.Fragment />
  }

  renderProduct () {
    return (
      <div className='fg-gray'>
        <div className='section bg-darkCyan'>
          <div className='text-center'>
            <h2 className='fg-white buy-title'>{products[this.state.code].name}</h2>
            <small className='fg-grayLighter'>Purchased on {new Date(this.state.purchaseDate).toLocaleDateString()}</small>
          </div>
        </div>
        <div className='grid container small section text-center'>
          <div className='row'>
            <div>
              <h3>LICENSE KEY</h3>
            </div>
            <LicenseKey licenseKey={this.state.licenseKey} />
          </div>
          <div className='row'>{this.state.isSubscription ? this.renderSubscrption() : this.renderOneTime()}</div>
          <div className='row'>
            <div>
              <h3>Invoices</h3>
            </div>
            {this.state.invoices.map(i => (
              <Invoice invoice={i} customerId={this.props.match.params.customer} key={i.data.invoiceId} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  renderPlaceholder () {
    return <div />
  }

  render () {
    return this.state.code ? this.renderProduct() : this.renderPlaceholder()
  }
}
