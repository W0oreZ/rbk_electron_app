import React from 'react';
import { Route, Switch } from 'react-router-dom';
import MainView from './components/MainView';
import SettingsView from './components/SettingsView';

function App() {
  return (
    <div className="container">
      <Switch>
        <Route exact path="/" render={(props) => <MainView {...props} />} />
        <Route
          exact
          path="/settings"
          render={(props) => <SettingsView {...props} />}
        />
      </Switch>
    </div>
  );
}

export default App;
