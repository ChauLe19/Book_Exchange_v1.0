import React, { Component } from 'react';
import { render } from 'react-dom';

import {
    ApolloClient,
    InMemoryCache,
    useQuery,
    gql,
    ApolloProvider,
    createHttpLink
    /*NormalizedCacheObject*/
} from '@apollo/client';
import { setContext } from "@apollo/client/link/context"
// import SearchPage from "./pages/SearchPage"
import LoginPage from "./pages/LoginPage"
import Home from "./pages/Home"
import BookPage from "./pages/BookPage"
import SearchPage from "./pages/SearchPage"
import SearchBar from "./components/SearchBar"
import SellPage from "./pages/SellPage"
import MyShelves from "./pages/MyShelves"
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom"


const httpLink = createHttpLink({
    uri: 'http://localhost:2000/',
    credentials: "same-origin",
})

const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem("token");
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : ""
        }
    }
})
const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache()
});



class App extends Component {
    constructor() {
        super()
        this.state = {
            authToken: localStorage.getItem("token")
        }
        this.handleLogin = this.handleLogin.bind(this)
    }
    handleLogin(){
        this.setState({
            authToken:localStorage.getItem("token")
        })
    }
    render() {

        return (
            <Router>
                <ApolloProvider client={client}>
                    <div>
                        <SearchBar />
                        <ul>
                            <li>
                                <Link to="/">Home</Link>
                            </li>
                            {(!this.state.authToken && <li>
                                <Link to="/login">Login</Link>
                            </li>)||
                                <li>
                                    <Link to="#" onClick={e=>{localStorage.clear(); this.handleLogin()}}>Logout</Link>
                                </li>
                            }
                            <li>
                                <Link to="/user/sell">Sell Book</Link>
                            </li>
                            <li>
                                <Link to="/my">My Shelves</Link>
                            </li>
                        </ul>
                    </div>
                    <Switch>

                        <Route path="/search">
                            <h2>SearchPage</h2>
                            <SearchPage />
                        </Route>
                        <Route path="/forSaleBooks/:bookId">
                            <h2>Book Page</h2>
                            <BookPage />
                        </Route>
                        <Route path="/my">
                            <h2>My shelves</h2>
                            <MyShelves />
                        </Route>
                        <Route path="/book/isbn">
                            <h2>Book Info</h2>
                            <BookInfo />
                        </Route>
                        <Route path="/login" render={(props)=><LoginPage handleLogin={this.handleLogin} props={props}/>}/>
                        <Route path="/user/sell" render={()=><SellPage />}/>
                        <Route path="/register" render={(props)=><LoginPage handleLogin={this.handleLogin} props={props}/>}/>
                        <Route path="/" render={(props)=><Home history={props.history}/>}/>
                    </Switch>
                </ApolloProvider>
            </Router>
        )
    }
}

function BookInfo() {
    return (
        <h2>BookInfo</h2>
    )
}


render(<App />, document.getElementById('root'));
