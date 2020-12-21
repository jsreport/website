import React from 'react'
import GumroadInvoices from './gumroadInvoices'
import Peru from './peru.jsx'
import { saveAs } from 'filesaver.js-npm'

const data = {}
const finalizers = []
function onFinalize (f) {
  finalizers.push(f)
}

async function finalize () {
  finalizers.forEach(f => f(data))
  console.log(data)

  try {
    const res = await fetch('/api/payments/taxes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })

    const blob = await res.blob()
    saveAs(blob, 'taxes.zip')

    alert('Done')
  } catch (e) {
    console.error(e)
  }
}

export default ({ props }) => (
  <div className='fg-gray'>
    <div className='section bg-darkCyan'>
      <div className='text-center'>
        <h2 className='fg-white buy-title'>Taxes</h2>
      </div>
    </div>
    <div className='grid container small section'>
      <div className='row text-center'>
        <GumroadInvoices onFinalize={onFinalize} />
      </div>
      <div className='row text-center'>
        <Peru onFinalize={onFinalize} />
      </div>
      <div className='row text-center'>
        <button onClick={() => finalize()}>Create taxes input</button>
      </div>
    </div>
  </div>
)
