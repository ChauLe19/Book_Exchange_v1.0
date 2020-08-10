import React, { Component } from 'react'

class SearchBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchType: "isbn"
        }
    }


    render() {
        return (
            <div>
                <form id="search-form" action="/search" method="GET">
                    <select name="searchType">
                        <option value="q">All</option>
                        <option value="isbn">ISBN</option>
                        <option value="intitle">Title</option>
                        <option value="inauthor">Author</option>
                        <option value="inpublisher">Publisher</option>
                    </select>
                    <input className="search-bar" name="search-key" type="text" placeholder="Search for books" required />
                    <input className="search-button" type="submit" form="search-form" value="&#128269;" />
                </form>
            </div>
        )
    }
}

export default SearchBar