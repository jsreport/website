import React from 'react'
import { validateVAT } from './customerCheckout.js'

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
      <div className="coll2">
        <label>VAT number (only EU companies)</label>
        <small>
          <input
            disabled={this.props.disabled}
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
                The VAT number is invalid and will not be used. If your company is established in the EU and has a valid VAT number, please contact us before making your purchase so we can resolve the issue.
              </b>
            </small>
          )}
        </div>
      </div>
    )
  }
}
