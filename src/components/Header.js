import React, { Component, Fragment } from 'react'
import SearchBar from './SearchBar';
import { Link } from 'react-router-dom';

class Header extends Component {
    constructor(props) {
        super(props);
    }


    render() {
        return (
            <div className="header">
                <h2 style={{color: "white"}}>
                    Book Trader
                </h2>
                <SearchBar />
                <ul className="inline-list">
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                    {(!this.props.isLogin && <li>
                        <Link to="/login">Login</Link>
                    </li>) ||
                        <Fragment>

                            <li>
                                <Link to="#" onClick={e => { localStorage.clear(); this.props.handleLogin() }}>Logout</Link>
                            </li>
                            <li>
                                <Link to="/my/book-shelf">My Shelves</Link>
                            </li>
                        </Fragment>

                    }
                    {/* <li>
                    <Link to="/user/sell">Sell Book</Link>
                </li> */}
                </ul>
            </div>
        )
    }
}

export default Header