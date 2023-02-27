import React from 'react'
import LicenseKey from './licenseKey'
import products from '../../shared/products'
import StripeForm from './stripeForm'

function loadCustomer (uuid) {
  return window.fetch(`/api/payments/customer/${uuid}`).then((r) => r.json())
}

function currencyChar (currency) {
  return currency === 'usd' ? '$' : '€'
}

function Invoice ({ sale, customerId }) {
  return (
    <div>
      <div>
        <a
          href={`/payments/customer/${customerId}/invoice/${sale.id}`}
          target='_blank'
          rel='noopener noreferrer'
          className='text-center fg-cyan fg-hover-green'
          style={{ cursor: 'pointer' }}
        >
          <i className='icon-download' />
          <span className='padding5'>{new Date(sale.purchaseDate).toLocaleDateString()}</span>
          <span className='padding5'>{sale.id}</span>
          <span className='padding5'>{sale.accountingData.amount + currencyChar(sale.accountingData.currency)}</span>
        </a>
      </div>
    </div>
  )
}

function Support ({ product }) {
  return (
    <div className='row'>
      <div>
        <h3>SUPPORT</h3>
      </div>
      <div>
        Please register to the{' '}
        <a href='https://support.jsreport.net' target='_blank' rel='noopener noreferrer'>
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
  constructor () {
    super()
    this.state = {}
  }

  componentDidMount () {
    this.load()
  }

  load () {
    loadCustomer(this.props.match.params.customer).then((c) => {
      const product = c.products.find((p) => p.id === this.props.match.params.product)
      this.setState({
        ...product,
        customer: c,
        updating: false
      })
    })
  }

  async cancel () {
    if (!window.confirm('Are you sure you want to cancel the next renewal?')) {
      return
    }

    try {
      const res = await window.fetch(`/api/payments/customer/${this.props.match.params.customer}/subscription/${this.state.id}`, {
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

  async updatePaymentMethod (i) {
    const shouldSendSetupIntend = this.state.subscription.state !== 'canceled' && !this.state.subscription.plannedCancelation
    const res = await window.fetch(`/api/payments/customer/${this.props.match.params.customer}/subscription/${this.state.id}`, {
      method: 'PUT',
      body: JSON.stringify({
        paymentIntentId: shouldSendSetupIntend ? null : i.id,
        setupIntentId: shouldSendSetupIntend ? i.id : null
      }),
      headers: {
        'Content-Type': 'application/json'
      }
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

  renderBankCard () {
    return (
      <span>
        The current used bank card is ****{this.state.subscription.card.last4} expiring on {this.state.subscription.card.expMonth}/
        {this.state.subscription.card.expYear}
      </span>
    )
  }

  renderSubscrption () {
    return (
      <>
        <div>
          <h3>SUBSCRIPTION</h3>
        </div>
        {this.state.subscription.state !== 'canceled'
          ? (
            <>
              <p>
                {this.state.subscription.plannedCancelation
                  ? <span style={{ color: 'red' }}>The renewal payment wasn't successful and the subscription will be canceled on {new Date(this.state.subscription.plannedCancelation).toLocaleDateString()}. <br /> Please update the payment in order to renew the subscription. <br /><br /></span>
                  : <span>The next payment is planned on {new Date(this.state.subscription.nextPayment).toLocaleDateString()} <br /></span>}

                {this.renderBankCard()}
              </p>
              {!this.state.updating
                ? (
                  <>
                    <button className='button danger' onClick={() => this.cancel()} style={{ marginRight: '10px' }}>
                      Cancel renewal
                    </button>
                  </>
                  )
                : (
                  <></>
                  )}
            </>
            )
          : (
            <>
              <button className='button danger' style={{ marginRight: '10px' }}>
                Canceled
              </button>
            </>
            )}
        <>
          {!this.state.updating
            ? (
              <button className='button info' onClick={() => this.setState({ updating: true })}>
                {this.state.subscription.state === 'canceled' ? 'Reactivate' : 'Update payment'}
              </button>)
            : (<></>)}
        </>
        <div>
          {this.state.updating
            ? (
              <StripeForm
                email={this.state.customer.email}
                onSubmit={(i) => this.updatePaymentMethod(i)}
                setupIntent={this.state.subscription.state !== 'canceled' && !this.state.subscription.plannedCancelation}
                customerId={this.props.match.params.customer}
                amount={this.state.sales[this.state.sales.length - 1].accountingData.amount}
              />
              )
            : (
              <></>
              )}
        </div>
      </>
    )
  }

  renderOneTime () {
    return <></>
  }

  renderLicenseKey () {
    return (
      <div className='row'>
        <div>
          <h3>LICENSE KEY</h3>
        </div>
        <LicenseKey licenseKey={this.state.licenseKey} />
        <div>
          <a href='https://jsreport.net/learn/faq#how-to-apply-license-key' target='_blank' rel='noopener noreferrer'>
            license key application instructions
          </a>
        </div>
      </div>
    )
  }

  renderProductInner () {
    if (this.state.isSupport) {
      return <Support product={this.state} />
    }

    if (this.state.licenseKey) {
      return this.renderLicenseKey()
    }

    return <></>
  }

  changePlan (code) {
    if (window.confirm('This will redirect you to the payment form, and after successful payment, you will be charged monthly only for the new plan. The credits change will have an immediate effect.')) {
      this.props.history.push(`/payments/customer/${this.state.customer.uuid}/checkout/${this.state.code}/${code}`)
    }
  }

  renderPlan () {
    const product = products[this.state.code]
    const plan = product.plans[this.state.planCode]

    return (
      <div>
        <h3>PLAN</h3>
        <div>
          <span>Curren plan: <strong>{plan.name}</strong></span>
          <p>{plan.infoLine}</p>
        </div>
        <div>
          <label>Change plan:</label>
          <select className='button info' style={{ marginLefth: '10px' }} value={this.state.planCode} onChange={(ev) => this.changePlan(ev.target.value)}>
            {Object.keys(product.plans).map(k => <option key={k} value={k}>{product.plans[k].name}</option>)}
          </select>
        </div>
      </div>
    )
  }

  renderSupportPromotion () {
    const product = products[this.state.code]
    console.log('product', product)
    if (!product.promoteSupport || this.state.customer.products.find(p => p.isSupport)) {
      return <></>
    }

    return (
      <div className='row'>
        <div>
          <h3>Support</h3>
        </div>
        <p>
          Commercial support isn't part of the license, you can purchase it here:
        </p>
        <button className='button info' onClick={() => (location.href = `/payments/customer/${this.props.match.params.customer}/checkout/supportSubscription`)}>
          Purchase support
        </button>
      </div>
    )
  }

  renderProduct () {
    return (
      <div className='fg-gray'>
        <div className='section bg-darkCyan'>
          <div className='text-center'>
            <h2 className='fg-white buy-title'>{products[this.state.code].name}</h2>
            {this.state.planCode
              ? <h3 className='fg-white'>{products[this.state.code].plans[this.state.planCode].name} plan</h3>
              : <></>}
            <div>
              <small className='fg-grayLighter'>Purchased on {new Date(this.state.sales[0].purchaseDate).toLocaleDateString()}</small>
            </div>
            <div>
              <small>
                <a className='fg-grayLighter' style={{ cursor: 'pointer' }} href={'/payments/customer/' + this.props.match.params.customer}>
                  <i className='icon-arrow-left-3' /> Back to customer dashboard <i className='icon-arrow-left-3' />
                </a>
              </small>
            </div>
          </div>
        </div>
        <div className='grid container small section text-center'>
          {this.renderProductInner()}
          <div className='row'>{this.state.isSubscription ? this.renderSubscrption() : this.renderOneTime()}</div>
          {this.state.planCode ? <div className='row'>{this.renderPlan()}</div> : <></>}
          {this.renderSupportPromotion()}
          <div className='row'>
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

  renderPlaceholder () {
    return <div />
  }

  render () {
    return this.state.code ? this.renderProduct() : this.renderPlaceholder()
  }
}
