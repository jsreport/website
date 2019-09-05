import React from 'react'
import Spinner from './spinner'

function Error ({ error }) {
  if (!error) {
    return null
  }

  return (
    <div className='row'>
      <b style={{ color: 'red' }}>{error}</b>
    </div>
  )
}

function SubmitButton ({ visible, onSubmit }) {
  if (!visible) {
    return null
  }

  return (
    <div className='row'>
      <a onClick={() => onSubmit()} className='button text-center bg-green bg-hover-gray btn'>
        <span className='fg-white'>Submit</span>
      </a>
    </div>
  )
}

export default class Braintree extends React.Component {
  constructor () {
    super()
    this.state = {}
  }

  componentDidMount () {
    return this.load()
  }

  async load () {
    this.setState({
      loading: true
    })
    const token = await window.fetch('/api/braintree-token').then(res => res.text())
    this.braintreeInstance = await braintree.dropin.create({
      authorization: token,
      container: '#dropin-container'
    })
    this.setState({
      loading: false
    })
  }

  componentWillUnmount () {
    if (this.braintreeInstance) {
      return this.braintreeInstance.teardown()
    }
  }

  async submit () {
    try {
      this.setState({
        loading: true
      })
      const paymentMethod = await this.braintreeInstance.requestPaymentMethod()
      await this.props.onSubmit(paymentMethod)
    } catch (e) {
      this.braintreeInstance.teardown()
      this.setState({
        error: e.message
      })
      this.load()
    }
  }

  render () {
    return (
      <React.Fragment>
        <Error error={this.state.error} />
        <Spinner loading={this.state.loading} />
        <div />
        <div id='dropin-container' />
        <SubmitButton visible={!this.state.loading} onSubmit={() => this.submit()} />
      </React.Fragment>
    )
  }
}
