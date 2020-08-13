import React, { Component, useState } from "react"
import { Redirect } from "react-router-dom"
import {
    useMutation,
    gql
} from "@apollo/client"

const LOGIN = gql`
    mutation login($email:String!, $password:String!){
        login(email:$email,password:$password){
    token
    user{
      id
      username
    }
    }
}`

const SIGNUP = gql`
    mutation signup($email:String!, $username:String!, $password:String!){
        signup(email:$email,username:$username,password:$password){
            user{
            username
            }
            token
        }
    }
`

function LoginForm(props) {
    const [login, { data:loginData }] = useMutation(LOGIN)
    const [signup, {data:signupData}] = useMutation(SIGNUP)
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
            <ul>

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
                                    login({
                                        variables: {
                                            email,
                                            password
                                        }
                                    }).then(data => {
                                        localStorage.setItem("token", data.data.login.token)
                                        setIsLoggedIn(true)
                                        props.handleLogin()
                                    })
                                    .catch(err=>setMessage("Error has occured. Please check your email or password."))

                                } : e => {
                                    e.preventDefault()
                                    if(password!==repassword) throw new Error("Not same password")
                                    signup({
                                        variables:{
                                            email,
                                            username,
                                            password
                                        }
                                    }).then(data=> props.history.push("/login"))

                                }}> {props.isLogin ? "Login" : "Register"} </button>
                    </li>
                </form>
                <li>
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