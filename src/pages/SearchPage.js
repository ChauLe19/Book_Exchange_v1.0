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
const gr = goodreads({
    key: 'aGq3pBvYR4i8kejiE6rA',
    secret: '7WYqJmW6DUTW84k170CaG31VLSQ8ccgqRsYehx0aX4'
});
function SearchPage() {
    // const match = useRouteMatch();
    // const {searchKey} = useParams();
    // const [items, setItems] = useState([])
    const [message, setMessage] = useState("")
    const query = new URLSearchParams(useLocation().search)
    const searchKey = query.get("search-key")
    const searchType = query.get("searchType")
    const worksRegex = /(?<=\/works\/).+/
    // let fullItems = []
    // const [startIndex,setStartIndex] = useState(0)
    // const [fullItems, setFullItems] = useState([])
    const [loadMoreVars, setLoadMoreVars] = useState({
        fullItems: [],
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
        // const paramObj = {}
        // paramObj["title"] = searchKey;

        // let params = new URLSearchParams(paramObj)
        // fetch("http://openlibrary.org/search.json?" + params)
        //     .then(res => res.json())
        //     .then(data => {

        //         const fullItems = data.docs;
        //         console.log(loadMoreVars)
        //         setLoadMoreVars({
        //             fullItems,
        //             hasMore: loadMoreVars.page < 10,
        //             // hasMore: false,
        //             items: items.concat(fullItems.slice(loadMoreVars.page * 10, loadMoreVars.page * 10 + 10)),
        //             page: 1
        //         })
        //     }
        //     )
//         gr.getBooksByAuthor('175417')
// .then(console.log);
//         console.log("Something")

        gr.searchBooks({q:"pikachu"})
        .then((data)=>console.log(data))
        // fetch("https://www.goodreads.com/search/index.xml?field=title&key=aGq3pBvYR4i8kejiE6rA&q=pikachu",{
        //     mode:"no-cors"
        // })
        // .then(data => data.text())
        // .then(data => console.log(data))
    }, [])

    async function fetchBooks() {
        // const paramObj = {}
        // paramObj["title"]= searchKey;

        // let params= new URLSearchParams(paramObj)
        // fetch("http://openlibrary.org/search.json?" + params)
        // .then(res=>res.json())
        // .then(data => 
        //     {
        //         // console.log(data.docs)
        //     }
        //     )
        setLoadMoreVars({
            fullItems: loadMoreVars.fullItems,
            hasMore: loadMoreVars.page < 10,
            items: loadMoreVars.items.concat(loadMoreVars.fullItems.slice(loadMoreVars.page * 10, loadMoreVars.page * 10 + 10)),
            page: loadMoreVars.page + 1
        })
        return console.log(loadMoreVars.items)
    }

    return (
        <InfiniteScroll
            className="row"
            style={{ textAlign: "center" }}
            key="InfiniteScroll"
            loadMore={fetchBooks}
            hasMore={loadMoreVars.hasMore}
            loader={<p key="loading">Loading...</p>}
        >
            {/* {console.log(loadMoreVars)} */}
            {items.map(item => {
                if (!item) return
                const id = worksRegex.exec(item.key).toString()
                // console.log(id)

                return <DBBookBox
                    key={id}
                    title={item.title}
                    subtitle={item.subtitle}
                    imgHref={item.cover_i ? `http://covers.openlibrary.org/b/ID/${item.cover_i}-M.jpg` : "https://islandpress.org/sites/default/files/default_book_cover_2015.jpg"}
                    author={item.author_name}
                    publisher={item.publisher}
                    isbn={item.isbn}
                    publishedDate={item.publishedDate}
                    volumeIdGG={id} />
            })
            }

            {message}
        </InfiniteScroll>
    )
}

export default SearchPage