import React from "react"
import { Route, Redirect } from "react-router-dom"
import { useSelector } from "react-redux"

const PrivateRoute = ({ component: Component, ...rest }) => {
  const { isAuthenticated, loading } = useSelector((state) => state.auth)

  return (
    <Route
      {...rest}
      render={(props) =>
        loading ? <div>Loading...</div> : isAuthenticated ? <Component {...props} /> : <Redirect to="/login" />
      }
    />
  )
}

export default PrivateRoute

