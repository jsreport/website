import React from 'react'
import LicenseKey from './licenseKey'
import products from './products'
import StripeForm from './stripeForm'

function loadCustomer(uuid) {
  return window.fetch(`/api/payments/customer/${uuid}`).then((r) => r.json())
}

function currencyChar(currency) {
  return currency === 'usd' ? '$' : '€'
}

function Invoice({ sale, customerId }) {
  return (
    <div>
      <div>
        <a
          href={`/payments/customer/${customerId}/invoice/${sale.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-center fg-cyan fg-hover-green"
          style={{ cursor: 'pointer' }}
        >
          <span className="padding5">{sale.id}</span>
          <span className="padding5">{sale.accountingData.amount + currencyChar(sale.accountingData.currency)}</span>
          <i className="padding5 icon-download" />
        </a>
      </div>
    </div>
  )
}

function Support({ product }) {
  return (
    <div className="row">
      <div>
        <h3>SUPPORT</h3>
      </div>
      <div>
        Please register to the{' '}
        <a href="https://support.jsreport.net" target="_blank" rel="noopener noreferrer">
          support portal
        </a>{' '}
        and follow the instructions there.
        <br />
        <br />
        You can also use email support@jsreport.net for support questions and incidents.
        <br />
        However, the support portal is the preferred way to contact us.
        <br />
        Please always mention your're support subscriber in case you decide to use the email.
        <br />
        <br />
      </div>
    </div>
  )
}

export default class Product extends React.Component {
  constructor() {
    super()
    this.state = {}
  }

  componentDidMount() {
    this.load()
  }

  load() {
    loadCustomer(this.props.match.params.customer).then((c) => {
      const product = c.products.find((p) => p.id === this.props.match.params.product)
      this.setState({
        ...product,
        customer: c,
        updating: false,
      })
    })
  }

  async cancel() {
    if (!window.confirm('Are you sure you want to cancel this subscription?')) {
      return
    }

    try {
      const res = await window.fetch(`/api/payments/customer/${this.props.match.params.customer}/subscription/${this.state.id}`, {
        method: 'DELETE',
      })

      const resJson = await res.json()

      if (!res.ok) {
        return alert(resJson.error)
      }

      this.setState({
        subscription: {
          ...this.state.subscription,
          status: 'canceled',
        },
      })
    } catch (e) {
      return alert(e.message)
    }
  }

  async updatePaymentMethod(i) {
    const res = await window.fetch(`/api/payments/customer/${this.props.match.params.customer}/subscription/${this.state.id}`, {
      method: 'PUT',
      body: JSON.stringify({
        paymentIntentId: this.state.subscription.plannedCancelation ? i.id : null,
        setupIntentId: this.state.subscription.plannedCancelation ? null : i.id,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const resJson = await res.json()

    if (this.state.subscription.plannedCancelation) {
      alert('Payment successful, subscription is renewed.')
    }

    if (!res.ok) {
      throw new Error(resJson && resJson.error ? resJson.error : res.statusText)
    }

    this.load()
  }

  renderBankCard() {
    return (
      <span>
        The current used bank card is ****{this.state.subscription.card.last4} expiring on {this.state.subscription.card.expMonth}/
        {this.state.subscription.card.expYear}
      </span>
    )
  }

  renderSubscrption() {
    return (
      <>
        <div>
          <h3>SUBSCRIPTION</h3>
        </div>
        {this.state.subscription.status !== 'canceled' ? (
          <div>
            <p>
              The next payment is planned on {new Date(this.state.subscription.nextPayment).toLocaleDateString()}
              <br />
              {this.renderBankCard()}
            </p>
            {!this.state.updating ? (
              <>
                <button className="button info" style={{ marginRight: '10px' }} onClick={() => this.setState({ updating: true })}>
                  Update payment
                </button>
                <button className="button danger" onClick={() => this.cancel()}>
                  Cancel
                </button>
              </>
            ) : (
              <></>
            )}
            {this.state.updating ? (
              <StripeForm
                email={this.state.customer.email}
                onSubmit={(i) => this.updatePaymentMethod(i)}
                setupIntent={!this.state.subscription.plannedCancelation}
                amount={this.state.sales[this.state.sales.length - 1].accountingData.amount}
              />
            ) : (
              <></>
            )}
          </div>
        ) : (
          <div>
            <span className="bg-red fg-white" style={{ padding: '3px' }}>
              Canceled
            </span>
          </div>
        )}
      </>
    )
  }

  renderOneTime() {
    return <></>
  }

  renderProduct() {
    return (
      <div className="fg-gray">
        <div className="section bg-darkCyan">
          <div className="text-center">
            <h2 className="fg-white buy-title">{products[this.state.code].name}</h2>
            <div>
              <small className="fg-grayLighter">Purchased on {new Date(this.state.sales[0].purchaseDate).toLocaleDateString()}</small>
            </div>
            <div>
              <small>
                <a className="fg-grayLighter" style={{ cursor: 'pointer' }} href={'/payments/customer/' + this.props.match.params.customer}>
                  <i className="icon-arrow-left-3" /> Back to customer dashboard <i className="icon-arrow-left-3" />
                </a>
              </small>
            </div>
          </div>
        </div>
        <div className="grid container small section text-center">
          {this.state.isSupport ? (
            <Support product={this.state} />
          ) : (
            <div className="row">
              <div>
                <h3>LICENSE KEY</h3>
              </div>
              <LicenseKey licenseKey={this.state.licenseKey} />
              <div>
                <a href="https://jsreport.net/learn/faq#how-to-apply-license-key" target="_blank" rel="noopener noreferrer">
                  license key application instructions
                </a>
              </div>
            </div>
          )}
          <div className="row">{this.state.isSubscription ? this.renderSubscrption() : this.renderOneTime()}</div>
          <div className="row">
            <div>
              <h3>Invoices</h3>
            </div>
            {this.state.sales.map((s) => (
              <Invoice sale={s} customerId={this.props.match.params.customer} key={s.id} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  renderPlaceholder() {
    return <div />
  }

  render() {
    return this.state.code ? this.renderProduct() : this.renderPlaceholder()
  }
}
