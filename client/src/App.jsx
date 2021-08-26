import React from "react";
import { Switch, Route } from 'react-router-dom';
import Loading from "./components/Loading";
import NotFound from "./pages/NotFound"

function App() {
  return (
    <React.Fragment>
      <Switch>
        <Loading/>
        <Route path="*" component={NotFound} />
      </Switch>
    </React.Fragment>
  )
}

export default App;
