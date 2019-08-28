import '@babel/polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import { load } from './customer.js'

function currencyChar (currency) {
  return currency === 'usd' ? '$' : '€'
}

function Invoice ({ invoice }) {
  function downloadInvoice () {
    window.open(window.location + '/invoice/' + invoice.data.invoiceId, '_blank')
  }

  return (
    <div>
      <div>
        <a onClick={downloadInvoice} className='text-center fg-green fg-hover-gray' style={{ cursor: 'pointer' }}>
          <span className='padding5'>{invoice.data.invoiceId}</span>
          <span className='padding5'>{invoice.data.amount + currencyChar(invoice.data.currency)}</span>
          <i className='padding5 icon-download' />
        </a>
      </div>
    </div>
  )
}

function Product ({ product }) {
  return (
    <div className='list marked'>
      <div className='list-content'>
        <h3>
          {product.type}
          <div>
            <small>Purchased on {new Date(product.purchaseDate).toLocaleDateString()}</small>
          </div>
        </h3>

        <div className='padding5'>
          <div>
            <span>License key</span>
          </div>
          <div>
            <span>{product.licenseKey}</span>
          </div>
        </div>

        <div>
          <div className='padding5'>
            <span>Invoices</span>
          </div>
          {product.invoices.map(i => <Invoice invoice={i} key={i.data.invoiceId} />)}
        </div>
      </div>
    </div>
  )
}

class Customer extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      products: []
    }
  }

  componentDidMount () {
    load().then((c) => this.setState({ ...c }))
  }

  render () {
    return (
      <div className='fg-gray'>
        <div className='section bg-darkCyan'>
          <div className='text-center'>
            <h1 className='fg-white buy-title'>Customer details</h1>
          </div>
        </div>
        <div className='grid container small section'>
          <div className='row text-center'>
            <div>
              <h3>DETAILS</h3>
            </div>
          </div>
          <div className='row'>
            <h3>{this.state.email}
              <div>
                <small>Created on {new Date(this.state.creationDate).toLocaleDateString()}</small>
              </div>
            </h3>
          </div>
        </div>
        <div className='grid container small section'>
          <div className='row text-center'>
            <div>
              <h3>PRODUCTS</h3>
            </div>
          </div>
          <div className='row'>
            <div className='listview-outlook'>
              {this.state.products.map(p => <Product key={p.purchaseDate} product={p} />)}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

ReactDOM.render(<Customer />, document.getElementById('root'))
