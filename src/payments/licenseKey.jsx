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
      <div>
        <CopyToClipboard text={this.props.licenseKey} onCopy={() => this.setState({ copied: true })}>
          <span onMouseEnter={() => this.handleCopyMouseIn()} onMouseLeave={() => this.handleCopyMouseOut()} onClick={e => e.stopPropagation()}>
            <span>{this.props.licenseKey}</span>
            {this.state.copyVisible ? (
              this.state.copied ? (
                <i style={{ marginLeft: '10px' }} className='fg-green icon-checkmark' />
              ) : (
                <i alt='copy to cliboard' style={{ marginLeft: '10px', cursor: 'pointer' }} className='fg-lightGray icon-copy' />
              )
            ) : (
              <React.Fragment />
            )}
          </span>
        </CopyToClipboard>
      </div>
    )
  }
}

export default LicenseKey
