import '@babel/polyfill'
import React from 'react'
import { load } from './customer.js'
import LicenseKey from './licenseKey'
import products from '../../shared/products'
import ReactModal from 'react-modal'

function Product ({ product, onClick }) {
  return (
    <div className='list marked' onClick={onClick}>
      <div className='list-content'>
        <h3>
          {products[product.code].name} {product.isSubscription && product.subscription.status === 'canceled' ? '( canceled )' : ''}
          <div>
            <small>Purchased on {new Date(product.sales[0].purchaseDate).toLocaleDateString()}</small>
          </div>
        </h3>

        {product.licenseKey
          ? (
            <div>
              <div>
                <div>
                  <span>License key</span>
                </div>
              </div>
              <LicenseKey licenseKey={product.licenseKey} />
            </div>
            )
          : (
            <div />
            )}
        <button style={{ marginTop: '1rem', marginBottom: '1rem' }} className='button info'>invoices and management</button>
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
    load(this.props.match.params.customer).then((c) => this.setState({ ...c }))
  }

  openProductDetail (p) {
    this.props.history.push(`/payments/customer/${this.state.uuid}/product/${p.id}`)
  }

  handleCloseModal () {
    this.setState({ modal: null })
  }

  async changeEmail (v) {
    try {
      const body = {}
      if (this.state.modal.type === 'notificationEmail') {
        body.notificationEmail = v === '' ? null : v
      } else {
        body.email = v
      }

      const res = await window.fetch(`/api/payments/customer/${this.state.uuid}`, {
        method: 'PUT',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!res.ok) {
        const resJson = await res.json()
        throw new Error(resJson && resJson.error ? resJson.error : res.statusText)
      }
      this.handleCloseModal()
    } catch (e) {
      alert('Failed to update email ' + e.message)
    }
  }

  render () {
    const { products, email, notificationEmail } = this.state
    products.reverse()

    return (
      <div className='fg-gray'>
        <div className='section bg-darkCyan'>
          <div className='text-center'>
            <h2 className='fg-white buy-title'>{this.state.email}</h2>
            <small className='fg-grayLighter'>Created on {new Date(this.state.creationDate).toLocaleDateString()}</small>
          </div>
        </div>
        <div className='grid container small section'>
          <div className='row text-center'>
            <button
              className='button warning' style={{ marginRight: '10px' }} onClick={() => this.setState({
                modal: {
                  title: 'Change administration email',
                  email,
                  type: 'email'
                }
              })}
            >
              Change admin email
            </button>
            <button
              className='button info' onClick={() => this.setState({
                modal: {
                  title: 'Change additional email for notifications about subscriptions renewals and cancelations',
                  email: notificationEmail,
                  type: 'notificationEmail'
                }
              })}
            >
              Change notification email {notificationEmail != null ? `(${notificationEmail})` : ''}
            </button>
          </div>
          <div className='row text-center'>
            <div>
              <h3>PRODUCTS</h3>
            </div>
          </div>
          <div className='row'>
            <div className='listview-outlook'>
              {products.map((p) => (
                <Product key={p.id} product={p} onClick={() => this.openProductDetail(p)} />
              ))}
            </div>
          </div>
        </div>
        <ReactModal
          isOpen={this.state.modal != null}
          onRequestClose={() => this.handleCloseModal()}
          style={customStyles}
        >
          <ChangeEmailModalContent
            close={() => this.handleCloseModal()}
            changeEmail={(v) => this.changeEmail(v)}
            email={this.state.email}
            {...this.state.modal}
          />
        </ReactModal>
      </div>
    )
  }
}

const ChangeEmailModalContent = (props) => {
  const ref = React.useRef(null)
  return (
    <form onSubmit={() => props.changeEmail(ref.current.value)}>
      <div className='grid fg-gray'>
        <div className='row text-center'>
          <span>{props.title}</span>
        </div>
        <div className='row text-center'>
          <label>email:</label>
          <input type='email' ref={ref} size='40' required={props.type !== 'notificationEmail'} defaultValue={props.email} />
        </div>
        <div className='row text-center'>
          <button style={{ marginRight: '10px' }} className='button warning' onClick={() => props.close()}>Cancel</button>
          <button type='submit' className='button info'>Confirm</button>
        </div>
      </div>
    </form>
  )
}

const customStyles = {
  content: {
    top: '40%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    minWidth: '500px',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)'
  },
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.65)'
  }
}

export default Customer
