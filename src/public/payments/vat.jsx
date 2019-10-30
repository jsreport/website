import React from 'react'
import { validateVAT } from './checkout.js'

export default class Vat extends React.Component {
  constructor () {
    super()
    this.state = {
      isValid: true
    }
  }

  onChange (e) {
    this.props.onChange(e)
  }

  validateVAT () {
    validateVAT(this.props.value)
      .then(r => {
        if (r === false) {
          this.setState({
            isValid: false
          })
        } else {
          this.setState({
            isValid: true
          })
          this.props.onValidVAT({
            name: r.name,
            address: r.address,
            country: r.country
          })
        }
      })
      .catch(console.error.bind(console))
  }

  render () {
    return (
      <div className='span4'>
        <label>VAT number (optional)</label>
        <small>
          <input className='fg-gray' type='text' size='30' onChange={v => this.onChange(v)} onBlur={() => this.validateVAT()} value={this.props.value} />
        </small>
        <div>
          {this.state.isValid || !this.props.value ? (
            <React.Fragment />
          ) : (
            <small>
              <b id='errorVAT' style={{ color: 'red' }}>
                The VAT number isn't valid and won't be used
              </b>
            </small>
          )}
        </div>
      </div>
    )
  }
}
