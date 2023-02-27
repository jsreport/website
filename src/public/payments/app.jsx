import React from 'react'
import ReactDOM from 'react-dom'
import Router from './router'
import Modal from 'react-modal'

ReactDOM.render(<Router />, document.getElementById('root'))
Modal.setAppElement('#root')
