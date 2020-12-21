import '@babel/polyfill'
import React, { useState, useRef } from 'react'
import moment from 'moment'

function createInitialInvoices () {
  const initialDate = moment.utc('7.7.2017', 'DD.MM.YYYY')

  const invoices = {}
  let accountingMonthStart = moment()
    .add(-1, 'M')
    .startOf('month')

  let date = initialDate

  let counter = 1
  while ((date = moment(date).add(7, 'day')) < accountingMonthStart) {
    counter++
  }

  const accountingMonthEnd = moment()
    .add(-1, 'M')
    .endOf('month')

  date = moment(date).add(-7, 'day')

  while ((date = moment(date).add(7, 'day')) < accountingMonthEnd) {
    const id = `${accountingMonthStart.toDate().getFullYear()}-${counter + 1}G`
    invoices[id] = {
      id,
      date: date.toDate()
    }
    counter++
  }
  return invoices
}

function gumroadInvoice ({ id, date, amount }, change) {
  return (
    <div key={id}>
      <span>Date</span>
      <input
        type='text'
        defaultValue={moment(date).format('DD.MM.YYYY')}
        onChange={ev =>
          change(amount, moment.utc(ev.target.value, 'DD.MM.YYYY').toDate())
        }
      />
      <span style={{ color: 'red' }}>USD</span>
      <input
        type='text'
        onChange={ev => change(parseFloat(ev.target.value), date)}
      />
    </div>
  )
}

export default ({ onFinalize }) => {
  const [invoices, setInvoices] = useState(createInitialInvoices())
  onFinalize(
    data => (data.gumroadInvoices = Object.keys(invoices).map(k => invoices[k]))
  )
  return (
    <div>
      <h3>Gumroad invoices</h3>
      {Object.keys(invoices).map(id =>
        gumroadInvoice(invoices[id], (v, d) => {
          setInvoices({
            ...invoices,
            [id]: {
              ...invoices[id],
              amount: v,
              date: d
            }
          })
        })
      )}
    </div>
  )
}
