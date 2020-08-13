import '@babel/polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import { load, cancelSubscription } from './customer.js'
import LicenseKey from './licenseKey'
import products from './products'

function currencyChar(currency) {
  return currency === 'usd' ? '$' : '€'
}

function Product({ product, onClick }) {
  return (
    <div className="list marked" onClick={onClick}>
      <div className="list-content">
        <h3>
          {products[product.code].name} {product.isSubscription && product.stripe.subscription.status === 'canceled' ? '( canceled )' : ''}
          <div>
            <small>Purchased on {new Date(product.sales[0].purchaseDate).toLocaleDateString()}</small>
          </div>
        </h3>

        {product.licenseKey ? (
          <div>
            <div className="padding5">
              <div>
                <span>License key</span>
              </div>
            </div>
            <LicenseKey licenseKey={product.licenseKey} />
          </div>
        ) : (
          <div />
        )}
      </div>
    </div>
  )
}

class Customer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      products: [],
    }
  }

  componentDidMount() {
    load(this.props.match.params.customer).then((c) => this.setState({ ...c }))
  }

  openProductDetail(p) {
    this.props.history.push(`/payments/customer/${this.state.uuid}/product/${p.id}`)
  }

  render() {
    const { products } = this.state
    products.reverse()

    return (
      <div className="fg-gray">
        <div className="section bg-darkCyan">
          <div className="text-center">
            <h2 className="fg-white buy-title">{this.state.email}</h2>
            <small className="fg-grayLighter">Created on {new Date(this.state.creationDate).toLocaleDateString()}</small>
          </div>
        </div>
        <div className="grid container small section">
          <div className="row text-center">
            <div>
              <h3>PRODUCTS</h3>
            </div>
          </div>
          <div className="row">
            <div className="listview-outlook">
              {products.map((p) => (
                <Product key={p.id} product={p} onClick={() => this.openProductDetail(p)} />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Customer
