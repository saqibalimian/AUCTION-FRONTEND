import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import AuctionDetails from './components/AuctionDetails';

function App() {
  return (
    <Router>
      <div className="App">
        <h1>Auction System</h1>
        <Switch>
          <Route exact path="/" component={Dashboard} />
          <Route path="/items/:id" component={AuctionDetails} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;