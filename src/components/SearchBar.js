import { SearchRounded, ShoppingBasket, ShoppingCart } from '@material-ui/icons';
import React, { Component } from 'react'
import { Button, InputAdornment } from '@material-ui/core';

class SearchBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchType: "isbn"
        }
    }


    render() {
        return (
            <form id="search-form" action="/search" method="GET" style={{display: "grid", gridTemplateColumns: "1fr 5fr 1fr"}}>
                <select name="searchType" style={{ backgroundColor: "#dbe1f0", color: "#192a56", border: "0.25rem solid #192a56", height: "100%", borderRadius: 0, padding: "0.5rem", borderBottomLeftRadius: "0.5rem", borderTopLeftRadius: "0.5rem", borderRightWidth: 0, textAlign: "center", width: "min-content"}}>
                    <option value="q">All</option>
                    <option value="title">Title</option>
                    <option value="isbn">ISBN</option>
                    <option value="author">Author</option>
                </select>
                <input className="search-bar" name="search-key" type="text" placeholder="Search" required style={{ borderRadius: 0, borderStyle: "solid", borderColor: "#192a56", outline: "none", borderWidth:"0.25rem", borderLeftWidth: "0.1rem", padding: "0.5rem" }} />
                {/* <input className="search-button" type="submit" form="search-form" value="&#128269;" /> */}
                <Button type='submit' variant='contained' color="primary" style={{ backgroundColor: "#192a56", borderWidth: 0, borderRadius: 0, borderTopRightRadius: "0.5rem", borderBottomRightRadius: "0.5rem" }}> <SearchRounded color='white' htmlColor='white' /></Button>
            </form>
        )
    }
}

export default SearchBar