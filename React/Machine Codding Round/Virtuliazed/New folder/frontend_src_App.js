import React from "react"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import { Provider } from "react-redux"
import store from "./store"

// Import components
import PrivateRoute from "./components/common/PrivateRoute"
import Header from "./components/layout/Header"
import Footer from "./components/layout/Footer"
import Sidebar from "./components/layout/Sidebar"
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import ResetPassword from "./components/auth/ResetPassword"
import DashboardPage from "./pages/DashboardPage"
import UsersPage from "./pages/UsersPage"
import NotFoundPage from "./pages/NotFoundPage"

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="flex min-h-screen bg-gray-100">
          <Sidebar />
          <div className="flex-1">
            <Header />
            <main className="container mx-auto px-4 py-8">
              <Switch>
                <Route exact path="/" component={HomePage} />
                <Route exact path="/login" component={LoginPage} />
                <Route exact path="/register" component={RegisterPage} />
                <Route exact path="/reset-password/:token" component={ResetPassword} />
                <PrivateRoute exact path="/dashboard" component={DashboardPage} />
                <PrivateRoute exact path="/users" component={UsersPage} />
                <Route component={NotFoundPage} />
              </Switch>
            </main>
            <Footer />
          </div>
        </div>
      </Router>
    </Provider>
  )
}

export default App

