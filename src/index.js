import React, { Component } from 'react';
import { render } from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './global.css';
// import SearchPage from "./pages/SearchPage"
import LoginPage from "./pages/LoginPage"
import Home from "./pages/Home"
import BookPage from "./pages/BookPage"
import SearchPage from "./pages/SearchPage"
import Header from "./components/Header"
import SellPage from "./pages/SellPage"
import MyShelves from "./pages/MyShelves"
import axios from 'axios';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom"
import { ThemeProvider, createTheme } from '@material-ui/core/styles';

const theme = createTheme({
    status: {
        danger: '#e53e3e',
      }
  });


class App extends Component {
    constructor() {
        super()
        const token = localStorage.getItem("token");
        this.state = {
            authToken: token
        }
        axios.defaults.headers.common['authorization'] = token ? `Bearer ${token}` : ""
        this.handleLogin = this.handleLogin.bind(this)
    }
    handleLogin() {
        const token = localStorage.getItem("token");
        this.setState({
            authToken: token
        })
        axios.defaults.headers.common['authorization'] = token ? `Bearer ${token}` : ""

        window.location.reload()
    }
    render() {

        return (
        <ThemeProvider theme={theme}>

            <Router>

                <Header isLogin={this.state.authToken} handleLogin={this.handleLogin} />
                <Switch>

                    <Route path="/search">
                        <SearchPage />
                    </Route>
                    <Route path="/forSaleBooks/:OL_ID">
                        <BookPage />
                    </Route>
                    <Route path="/my">
                        <MyShelves />
                    </Route>
                    <Route path="/book/isbn">
                        <h2>Book Info</h2>
                        <BookInfo />
                    </Route>
                    <Route exact path="/login" render={(props) => <LoginPage handleLogin={this.handleLogin} props={props} />} />
                    <Route exact path="/user/sell" render={() => <SellPage />} />
                    <Route exact path="/register" render={(props) => <LoginPage handleLogin={this.handleLogin} props={props} />} />
                    <Route exact path="/" render={(props) => <Home history={props.history} />} />
                </Switch>
            </Router>
        </ThemeProvider>
        )
    }
}

function BookInfo() {
    return (
        <h2>BookInfo</h2>
    )
}


render(<App />, document.getElementById('root'));
