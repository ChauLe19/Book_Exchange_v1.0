import React, { Component, Fragment } from 'react'
import SearchBar from './SearchBar';
import { Link } from 'react-router-dom';
import logo from '../logo-no-background.svg'
import Logo from './logo-svg';

class Header extends Component {
    constructor(props) {
        super(props);
    }


    render() {
        return (
            <div className="header row">
                <div className='col-3' style={{ width: "max-content", display: "flex", flexDirection: "row", alignItems: "baseline", justifyContent: "center" }}>
                    <div>
                        <Logo height="100px" width="100px" color="#273c75" />
                    </div>
                    <h3 style={{ display: "inline", fontWeight: "bold" }}>
                        Book Trader
                    </h3>
                </div>
                <div className='col-6' style={{ display: "flex", justifyContent: "center" }}>

                    <SearchBar />
                </div>
                <ul className="inline-list col-3" style={{ display: "flex", justifyContent: "center" }}>
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                    {(!this.props.isLogin && <li>
                        <Link to="/login">Login</Link>
                    </li>) ||
                        <Fragment>
                            <li>
                                <Link to="/my/book-shelf">My Shelves</Link>
                            </li>
                            <li>
                                <Link to="#" onClick={e => { localStorage.clear(); this.props.handleLogin() }}>Logout</Link>
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