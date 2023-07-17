import React, { Component, useState } from "react"
import { Redirect } from "react-router-dom"
import axios from 'axios'


function LoginForm(props) {
    const [email, setEmail] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [repassword, setRepassword] = useState("")
    const [message, setMessage] = useState("")
    const [isLoggedin, setIsLoggedIn] = useState(localStorage.getItem("token"))

    if (isLoggedin) {
        return <Redirect to="/" />
    }
    return (
        <div>
            <ul className="login-form">

                <form className="auth-form" >
                    {!props.isLogin && <li>
                        <input type="text" name="username" placeholder="Your username" onChange={e => setUsername(e.target.value)} value={username} />
                    </li>}
                    <li>
                        <input type="text" name="email" placeholder="Email" onChange={e => setEmail(e.target.value)} value={email} />
                    </li>
                    <li>
                        <input type="password" name="password" placeholder="**********" onChange={e => setPassword(e.target.value)} className="password-input" value={password} />
                    </li>
                    {!props.isLogin && <li>
                        <input type="password" placeholder="Re-enter password" id="repassword-input" onChange={e => setRepassword(e.target.value)} value={repassword} />
                    </li>}
                    <li>
                        <button type="submit" onClick={
                            props.isLogin ?
                                e => {
                                    e.preventDefault()
                                    axios.post('http://localhost:2000/login', {
                                        email, password
                                    }, {
                                        headers: {
                                            "Access-Control-Allow-Origin": "*",
                                            "Content-Type": "application/json"
                                        }
                                    }).then(data => {
                                        console.log(data.data)
                                        localStorage.setItem("token", data.data.token)
                                        setIsLoggedIn(true)
                                        props.handleLogin()
                                    })
                                    .catch(err=>setMessage("Error has occured. Please check your email or password."))

                                } : e => {
                                    e.preventDefault()
                                    if(password!==repassword) throw new Error("Not same password")
                                    axios.post('http://localhost:2000/signup', {
                                        email, password, username
                                    },{
                                        headers: {
                                            "Access-Control-Allow-Origin": "*",
                                            "Content-Type": "application/json"
                                        }
                                    }).then(data=> props.history.push("/login"))

                                }}> {props.isLogin ? "Login" : "Register"} </button>
                    </li>
                </form>
                <li className="error">
                            {message}
                </li>
                <li>
                            <a href={props.isLogin?"/register":"/login"}>{props.isLogin?"Don't have an account?":"Already have an account?"}</a>
                </li>
                <li><label for="checkbox">
                    <input type="checkbox" id="showPasswordCB" />Show
                    Password</label>
                </li>
                <li><a href="#">Forgot password?</a></li>
            </ul>
        </div>
    )
    // }
}

// function handleLogin() { }
// function handleRegister() { }

export default LoginForm