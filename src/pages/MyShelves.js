import React from "react"
// import { useLocation } from 'react-router-dom'
// import RegisterForm from "../components/RegisterForm"
import LoginForm from "../components/LoginForm"
import { useRouteMatch, Switch, Route } from "react-router-dom"
import MyStoreshelf from "./MyStoreshelf"
import MyBookshelf from "./MyBookshelf"
// import { 
//     BrowserRouter as Router,
//     Switch,
//     Route,
//     useRouteMatch
// } from "react-router-dom"
// import SearchBar from "../components/SearchBar"

function MyShelves() {
    const match = useRouteMatch()
    return (
        <Switch>
        <Route path={`${match.path}/book-shelf`}>
          <MyBookshelf />
        </Route>
        <Route path={`${match.path}/store-shelf`}>
          <MyStoreshelf />
        </Route>
      </Switch>
    )
}

export default MyShelves