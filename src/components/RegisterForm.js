import React, { Component } from "react"



class RegisterForm extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <form action="/register" className="auth-form" id="register-form" method="post">
                <li><input type="text" name="name" placeholder="Your name" /></li>
                <li><input type="text" name="email" placeholder="Email" /></li>
                <li><input type="password" name="password" placeholder="Password" className="password-input" /></li>
                <li><input type="password" placeholder="Re-enter password" id="repassword-input" /></li>
                <li><input type="submit" name="submit" value="Register" /></li>
                <label for='form-switch'>Already Member? Sign In</label>
            </form>

        )
    }
}

export default RegisterForm