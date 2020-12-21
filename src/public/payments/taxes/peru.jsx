import '@babel/polyfill'
import React, { useState, useRef } from 'react'
import moment from 'moment'

function PeruInvoice ({ date, onChangeAmount, onChangeDate }) {
  return (
    <div>
      <span>Date</span>
      <input
        type='text'
        defaultValue={moment(date).format('DD.MM.YYYY')}
        onChange={ev =>
          onChangeDate(moment.utc(ev.target.value, 'DD.MM.YYYY').toDate())
        }
      />
      <span style={{ color: 'red' }}>USD</span>
      <input
        type='text'
        onChange={ev => onChangeAmount(parseFloat(ev.target.value))}
      />
    </div>
  )
}

export default ({ onFinalize }) => {
  const [invoice, setInvoice] = useState({
    date: new Date(),
    id: new Date().getFullYear() + '-' + new Date().getMonth() + 'P',
    amount: 0
  })
  onFinalize(data => (data.peru = invoice))
  return (
    <div>
      <h3>Peru invoice</h3>
      <PeruInvoice
        date={invoice.date}
        onChangeAmount={v =>
          setInvoice({
            ...invoice,
            amount: v
          })
        }
        onChangeDate={v =>
          setInvoice({
            ...invoice,
            date: v
          })
        }
      />
    </div>
  )
}
