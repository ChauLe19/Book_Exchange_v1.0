import React, { Component } from 'react'
import SearchBar from './SearchBar';
import { Link } from 'react-router-dom';

class Header extends Component {
    constructor(props) {
        super(props);
    }


    render() {
        return (
            <div className="header">
                <SearchBar />
                <ul>
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                    {(!this.props.isLogin && <li>
                        <Link to="/login">Login</Link>
                    </li>) ||
                        <li>
                            <Link to="#" onClick={e => { localStorage.clear(); this.props.handleLogin() }}>Logout</Link>
                        </li>
                    }
                    <li>
                        <Link to="/user/sell">Sell Book</Link>
                    </li>
                    <li>
                        <Link to="/my/book-shelf">My Shelves</Link>
                    </li>
                </ul>
            </div>
        )
    }
}

export default Header