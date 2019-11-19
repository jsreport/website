import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Checkout from './checkout.jsx'
import Customer from './customer.jsx'
import Product from './product.jsx'
import CustomerLink from './customerLink.jsx'

function AppRouter () {
  return (
    <Router>
      <Switch>
        <Route path='/payments/checkout/:product' component={Checkout} />
        <Route path='/payments/customer/:customer/product/:product' component={Product} />
        <Route path='/payments/customer/:customer' component={Customer} />
        <Route path='/payments/customerLink' component={CustomerLink} />
      </Switch>
    </Router>
  )
}

export default AppRouter