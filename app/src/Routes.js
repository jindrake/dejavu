import React from 'react'
import { Route, Switch } from 'react-router-dom'
import Home from './pages/Home'

const Routes = () => (
  <Switch>
    <Route exact path='/home' component={Home} />
    // change component below ..
    <Route exact path='/profile' component={Home} />
    <Route exact path='/exam/:id' component={Home} />
  </Switch>
)

export default Routes
