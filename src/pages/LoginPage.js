import React from "react"
// import { useLocation } from 'react-router-dom'
// import RegisterForm from "../components/RegisterForm"
import LoginForm from "../components/LoginForm"
// import { 
//     BrowserRouter as Router,
//     Switch,
//     Route,
//     useRouteMatch
// } from "react-router-dom"
// import SearchBar from "../components/SearchBar"

function LoginPage({ handleLogin, props }) {

    // console.log(props)
    return (
        <div>
            <h4>Member {props.location.pathname}</h4>
            <LoginForm isLogin={props.location.pathname === "/login"} handleLogin={handleLogin} history={props.history} />

        </div>
    )
}

export default LoginPage