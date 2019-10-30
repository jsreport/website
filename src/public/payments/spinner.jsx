import React from 'react'

export default function Spinner ({ loading }) {
  if (!loading) {
    return null
  }

  return (
    <div className='row'>
      <i className='icon-spin fg-gray' id='spinner' style={{ animation: 'spin 1s linear infinite', fontSize: '3rem' }} />
    </div>
  )
}
