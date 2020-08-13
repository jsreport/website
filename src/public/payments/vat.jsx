import React from 'react'
import { validateVAT } from './checkout.js'

export default class Vat extends React.Component {
  constructor() {
    super()
    this.state = {
      isValid: true,
    }
  }

  onChange(e) {
    this.props.onChange(e)
  }

  validateVAT(v) {
    if (!v) {
      return
    }
    console.log('validate vat ' + v)
    validateVAT(v)
      .then((r) => {
        this.setState({
          isValid: r.isValid,
        })

        this.props.onVATValidated(r)
      })
      .catch(console.error.bind(console))
  }

  render() {
    return (
      <div className="span4">
        <label>VAT number (optional)</label>
        <small>
          <input
            className="fg-gray"
            type="text"
            size="30"
            onChange={(v) => this.onChange(v)}
            onBlur={(e) => this.validateVAT(e.target.value)}
            value={this.props.value}
          />
        </small>
        <div>
          {this.state.isValid || !this.props.value ? (
            <React.Fragment />
          ) : (
            <small>
              <b id="errorVAT" style={{ color: 'red' }}>
                The VAT number isn't valid and won't be used
              </b>
            </small>
          )}
        </div>
      </div>
    )
  }
}
