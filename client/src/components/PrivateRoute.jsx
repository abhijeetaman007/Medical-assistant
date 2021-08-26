import React, { ReactElement } from 'react';
import { Redirect, Route, useLocation } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';
import Landing from '../pages/Landing';
import Loading from './Loading';

export default function PrivateRoute({component: Component, ...rest}) {
  const auth = useAuth();
  const location = useLocation();

  return (
    <Route
      {...rest}
      render={(props) => {
        if (auth?.user) {
          return <Component {...props} />;
        } else {
          if (auth?.loading)
            return (
              <div className="screen-center">
                <Loading />
              </div>
            );
          if (location.pathname === '/') return <Landing />;
          else return <Redirect to="/login" />;
        }
      }}
    />
  );
}
