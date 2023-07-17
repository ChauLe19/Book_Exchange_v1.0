import React, { useState, useEffect, Fragment } from "react"
import goodreads from "goodreads-api-node"
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
import InfiniteScroll from "react-infinite-scroller"

function SearchPage() {
    // const match = useRouteMatch();
    // const {searchKey} = useParams();
    const [items, setItems] = useState([])
    const [message, setMessage] = useState("")
    const query = new URLSearchParams(useLocation().search)
    const searchKey = query.get("search-key")
    const searchType = query.get("searchType")
    const worksRegex = /(?<=\/works\/).+/

    useEffect(() => {
        fetch(`https://openlibrary.org/search.json?q=title%3A+"${searchKey}"`)
        .then(data => data.json())
        .then(data => setItems(data.docs))
        }, [])

    return (
    <div style={{width:"70%", margin: "auto"}}>

            {items.map(item => {
                if (!item) return
                const id = worksRegex.exec(item.key).toString()
                // console.log(id)

                return <DBBookBox
                    key={id}
                    title={item.title}
                    // subtitle={item.subtitle}
                    imgHref={item.cover_i ? `http://covers.openlibrary.org/b/ID/${item.cover_i}-M.jpg` : "https://islandpress.org/sites/default/files/default_book_cover_2015.jpg"}
                    author={item.author_name}
                    publisher={item.publisher}
                    ol_id={id}
                    publishedDate={item.publishedDate}
                    id={id}
                    />
            })}
    </div>
    );
}

export default SearchPage