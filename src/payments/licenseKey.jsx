import React from 'react'
import CopyToClipboard from 'react-copy-to-clipboard'

class LicenseKey extends React.Component {
  constructor () {
    super()
    this.state = {
      copyVisible: false,
      copied: false
    }
  }

  handleCopyMouseIn () {
    if (this.hideRef) {
      clearTimeout(this.hideRef)
    }
    this.setState({ copyVisible: true })
  }

  handleCopyMouseOut () {
    this.hideRef = setTimeout(() => this.setState({ copyVisible: false, copied: false }), 500)
  }

  render () {
    return (
      <div onMouseEnter={() => this.handleCopyMouseIn()} onMouseLeave={() => this.handleCopyMouseOut()} onClick={e => e.stopPropagation()}>
        <CopyToClipboard text={this.props.licenseKey} onCopy={() => this.setState({ copied: true })}>
          <div>
            <span>{this.props.licenseKey}</span>
            {this.state.copyVisible ? (
              this.state.copied ? (
                <i style={{ marginLeft: '10px' }} className='fg-green icon-checkmark' />
              ) : (
                <i style={{ marginLeft: '10px', cursor: 'pointer' }} className='fg-lightGray icon-copy' />
              )
            ) : (
              <React.Fragment />
            )}
          </div>
        </CopyToClipboard>
      </div>
    )
  }
}

export default LicenseKey
