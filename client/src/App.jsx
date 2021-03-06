import React from "react";
import { Switch, Route } from 'react-router-dom';
import PrivateRoute from "./components/PrivateRoute"
import NotFound from "./pages/NotFound"
import Home from "./pages/Home"
import Login from "./pages/auth/Login"
import Register from "./pages/auth/Register"
import VerifyMail from "./pages/auth/VerifyMail";

function App() {
  return (
    <React.Fragment>
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/verifyemail/:token" component={VerifyMail} />
        <PrivateRoute exact path={'/'} component={Home} />
        <Route path="*" component={NotFound} />
      </Switch>
    </React.Fragment>
  )
}

export default App;
