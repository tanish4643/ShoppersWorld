import React from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { Provider} from 'react-redux';
import Dashboard from "./Views/Dashboard";
import ShoppingCart from "./Views/ShoppingCart";

import getStore from './settings/store';
import Payment from "./Views/Payment";

const store = getStore();

class App extends React.Component {
  constructor(props){
    super(props);
  }

  render() {
    return(
      <Provider store={store}>
        <BrowserRouter>
            <Switch>
                <Route exact path="/" component={Dashboard} />
                <Route path="/cart" component={ShoppingCart} />
                <Route path="/payment" component={Payment} />
                <Redirect from="*" to="/" />
            </Switch>
        </BrowserRouter>
      </Provider>
    );
  }
}

export default App;