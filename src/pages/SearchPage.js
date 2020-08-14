import React, { useState, useEffect } from "react"

import {
    // BrowserRouter as Router,
    // Switch,
    // Route,
    // useParams,
    // useRouteMatch,
    useLocation
} from "react-router-dom"

import fetch from "node-fetch"
import DBBookBox from "../components/DBBookBox"
import { getAppropriateISBN } from "../fetchGGBooks"

function SearchPage() {
    // const match = useRouteMatch();
    // const {searchKey} = useParams();
    const [items, setItems] = useState([])
    const query = new URLSearchParams(useLocation().search) 
    const searchKey = query.get("search-key")
    const searchType = query.get("searchType")
    useEffect(() => {
        // console.log("https://www.googleapis.com/books/v1/volumes?q=" +searchType+":"+ searchKey)
        fetch("https://www.googleapis.com/books/v1/volumes?q=" +searchType+":"+ searchKey)
            .then(res => res.json())
            .then(data => {
                console.log(data.items)
                return setItems(data.items)
            })
    }, [])
    
    return (
        <div>
            <h3>You searched for {searchType}: {searchKey}</h3>
            {items? items.map(item => {
                const id = item.id
                item = item.volumeInfo;
                // console.log(item.industryIdentifiers[0].identifier)
                return <DBBookBox
                    key={id}
                    title={item.title}
                    subtitle={item.subtitle}
                    imgHref={item.imageLinks ? item.imageLinks.thumbnail : "https://islandpress.org/sites/default/files/default_book_cover_2015.jpg"}
                    author={item.authors}
                    publisher={item.publisher}
                    isbn={getAppropriateISBN(item.industryIdentifiers)}
                    publishedDate={item.publishedDate}
                    volumeIdGG={id} />
            }):
                "We found no books match."
            }
        </div>

    )
}

export default SearchPage