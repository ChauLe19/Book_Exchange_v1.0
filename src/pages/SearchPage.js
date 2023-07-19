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
import axios from "axios"
import SellerBookBox from "../components/SellerBookBox"

function SearchPage() {
    // const match = useRouteMatch();
    // const {searchKey} = useParams();
    const [items, setItems] = useState([])
    const [message, setMessage] = useState("")
    const query = new URLSearchParams(useLocation().search)
    const searchKey = query.get("search-key")
    const searchType = query.get("searchType")
    const worksRegex = /(?<=\/works\/).+/
    const [currentOLID, setCurrentOLID] = useState();
    const [forSaleBooks, setForSaleBooks] = useState([])
    const [bookInfo, setBookInfo] = useState({})

    useEffect(() => {
        fetch(`https://openlibrary.org/search.json?${searchType}=${searchKey}&limit=30`)
            .then(data => data.json())
            .then(data => { setItems(data.docs); setCurrentOLID(worksRegex.exec(data.docs[0].key).toString()) })
    }, [])

    useEffect(() => {
        if (currentOLID != undefined) {

            const loadBooks = () => {
                axios.get(`http://localhost:2000/forSale/${currentOLID}`)
                    .then(data => data.data)
                    .then(data => setForSaleBooks(data))
            }
            loadBooks()
        }
        // fetchBookById(OL_ID).then(book => {
        //     book.cover_i = book.covers.length > 0 ?`http://covers.openlibrary.org/b/id/${book.covers[0]}-M.jpg` :  "https://islandpress.org/sites/default/files/default_book_cover_2015.jpg";

        //     setBookInfo(book)
        // })
    }, [currentOLID])

    return (
        <div style={{ width: "90%", margin: "auto", display: "grid", gridTemplateColumns: "1fr 1fr", overflow: "hidden" }}>

            <div style={{ height: "100%", overflow: "scroll" }}>

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
                        rating={item.ratings_average}
                        onClick={() => setCurrentOLID(id)}
                        active={id == currentOLID}
                    />
                })}
            </div>
            <div id="sellers" style={{ height: "100%", overflow: "scroll", border: "0.5rem solid #192A56", borderWidth: "0.25rem" }}>
                {/* {(!forSaleBooks || forSaleBooks.length === 0) && (
                        <Fragment>

                            <p>There is no one selling this book. Try with another edition of this book or try again at a different time.</p>
                        </Fragment>
                    )
                    } */}
                <div style={{ backgroundColor: "#192A56", color: "white", textAlign: "center" }}>
                    Available books
                </div>
                {forSaleBooks && forSaleBooks.map(elem => <SellerBookBox key={elem.id} book_id={elem.book_id} sellerUsername={elem.owner_username} price={elem.price} dateForSale={elem.date_for_sale} />)}
            </div>
        </div>
    );
}

export default SearchPage