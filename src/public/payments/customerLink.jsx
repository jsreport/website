import '@babel/polyfill'
import React from 'react'
import ReactDOM from 'react-dom'

class CustomerLink extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
    }
  }

  async requestLink() {
    await window.fetch('/api/payments/customer-link', {
      method: 'POST',
      body: JSON.stringify({ email: this.state.email }),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    this.setState({
      emailSent: true,
    })
  }

  render() {
    return (
      <div className="fg-gray">
        <div className="section bg-darkCyan">
          <div className="text-center">
            <h2 className="fg-white buy-title">Get customer dashboard link</h2>
          </div>
        </div>
        <div className="grid container small section">
          {this.state.emailSent ? (
            <div className="row text-center">The email with link was sent to {this.state.email}</div>
          ) : (
            <div>
              <div className="row text-center">
                <div>
                  <h3>EMAIL</h3>
                  <small>
                    <p>
                        Please note customers that purchased through gumroad needs to request login <a href='https://gumroad.com' target='_blank'>here</a>.<br></br>
                        There are typically all customers that purchased before 08/2020.
                    </p>
                  </small>
                </div>
              </div>
              <div className="row text-center fg-gray">
                <small>
                  <input
                    className="fg-gray"
                    type="email"
                    size="40"
                    required
                    value={this.state.email}
                    onChange={(v) => this.setState({ email: v.target.value })}
                  />
                </small>
              </div>
              <div className="row text-center">
                <a className="button text-center bg-green bg-hover-gray btn" onClick={() => this.requestLink()}>
                  <span className="fg-white">Request link</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }
}

export default CustomerLink
