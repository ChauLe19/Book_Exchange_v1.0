import React, { useState, useEffect, Fragment } from "react"

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
    // const [items, setItems] = useState([])
    const [message, setMessage] = useState("")
    const query = new URLSearchParams(useLocation().search)
    const searchKey = query.get("search-key")
    const searchType = query.get("searchType")
    // const [startIndex,setStartIndex] = useState(0)
    const [loadMoreVars, setLoadMoreVars] = useState({
        hasMore: true,
        items: [],
        page: 0
    })
    const items = loadMoreVars.items
    // console.log(items)
    // let params = new URLSearchParams({
    //     q: `${searchType}:${searchKey}`,
    //     orderBy: "relevance",
    //     maxResults: 20,
    //     startIndex:loadMoreVars.startIndex
    // })
    // console.log(params.toString())
    useEffect(() => {
        // console.log("https://www.googleapis.com/books/v1/volumes?" + params)
        // fetch("https://www.googleapis.com/books/v1/volumes?" + params)
        //     .then(res => res.json())
        //     .then(data => {
        //         console.log(data.items)
        //         return setItems(data.items)
        //     })
        fetchBooks().then((items) => {
            if (items[0] === undefined) setMessage("We found no books match")
        })

    }, [])

    async function fetchBooks() {
        const params = new URLSearchParams({
            q: `${searchType}:${searchKey}`,
            orderBy: "relevance",
            maxResults: 10,
            startIndex: loadMoreVars.page * 10,
            printType:"books"
        })
        console.log(params.toString())
        return fetch("https://www.googleapis.com/books/v1/volumes?" + params)
            .then(res => res.json())
            .then(data => {
                // items.push(data.items)
                const items = loadMoreVars.items.concat(data.items);
                setLoadMoreVars({
                    hasMore: data.items != undefined,
                    items,
                    page: loadMoreVars.page + 1
                })
                // console.log(items)
                return items
            })

    }
    return (
        // <div>
        //     <h3>You searched for {searchType}: {searchKey}</h3>
        //     <div className="row" style={{margin:"0px", textAlign:"center"}}>
        //         {items ? items.map(item => {
        //             const id = item.id
        //             item = item.volumeInfo;
        //             // console.log(item.industryIdentifiers[0].identifier)
        //             return <DBBookBox
        //                 key={id}
        //                 title={item.title}
        //                 subtitle={item.subtitle}
        //                 imgHref={item.imageLinks ? item.imageLinks.thumbnail : "https://islandpress.org/sites/default/files/default_book_cover_2015.jpg"}
        //                 author={item.authors}
        //                 publisher={item.publisher}
        //                 isbn={getAppropriateISBN(item.industryIdentifiers)}
        //                 publishedDate={item.publishedDate}
        //                 volumeIdGG={id} />
        //         }) :
        //             "We found no books match."
        //         }
        //     </div>

        // </div>
        <InfiniteScroll
            className="row"
            style={{ textAlign: "center" }}
            key="InfiniteScroll"
            loadMore={fetchBooks}
            hasMore={loadMoreVars.hasMore}
            loader={<p key="loading">Loading...</p>}
        >
            {items.map(item => {
                if (!item) return
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
            })
            }

            {message}
        </InfiniteScroll>
    )
}

export default SearchPage