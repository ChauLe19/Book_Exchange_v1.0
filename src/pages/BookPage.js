import React, { useState, useEffect, Fragment } from "react"
import {
    // BrowserRouter as Router,
    // Switch,
    // Route,
    useParams,
    // useRouteMatch,
    // useLocation
} from "react-router-dom"
import SellerBookBox from "../components/SellerBookBox"
import axios from "axios"
import { fetchBookById } from "../fetchGGBooks";
import { Rating } from "@material-ui/lab";
// import DBBookBox from "../components/DBBookBox"
//
function BookPage() {
    const { OL_ID } = useParams();
    const [forSaleBooks, setForSaleBooks] = useState([])
    const [bookInfo, setBookInfo] = useState({})

    useEffect(() => {
        const loadBooks = () => {
            axios.get(`http://localhost:2000/forSale/${OL_ID}`)
                .then(data => data.data)
                .then(data => setForSaleBooks(data))
        }
        loadBooks()
        fetchBookById(OL_ID).then(book => {
            book.cover_i = book.covers.length > 0 ?`http://covers.openlibrary.org/b/id/${book.covers[0]}-M.jpg` :  "https://islandpress.org/sites/default/files/default_book_cover_2015.jpg";

            setBookInfo(book)
        })
        return () => { setForSaleBooks([]) }
    }, [])

    return (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", flexGrow: 2, overflow: "hidden" }}>
            <div id="book-info" style={{ height: "100%", overflow: "scroll", backgroundColor: "#192A56", color: "white", padding: "1rem" }}>
                <img src={bookInfo.cover_i} />
                <h4 style={{ fontWeight: "bold" }}>{bookInfo.title}</h4>
                {/* <p>{this.props.subtitle}</p> */}
                <p>by {bookInfo.author}</p>
                <p>Description: {bookInfo.description}</p>
                <Rating name="read-only" value={bookInfo.rating} precision={0.2} readOnly />
                <span style={{ verticalAlign: "super" }}>{(bookInfo.rating || 0).toFixed(2)}</span>
            </div>
            <div id="sellers" style={{ height: "100%", overflow: "scroll", border: "0.5rem solid #192A56", borderWidth: "0.25rem 0 0 0.25rem" }}>
                {/* {(!forSaleBooks || forSaleBooks.length === 0) && (
                        <Fragment>

                            <p>There is no one selling this book. Try with another edition of this book or try again at a different time.</p>
                        </Fragment>
                    )
                    } */}
                <div style={{ backgroundColor: "#192A56", color: "white", textAlign: "center" }}>
                    Available books
                </div>
                {forSaleBooks && forSaleBooks.map(elem => <SellerBookBox key={elem.id} sellerUsername={elem.owner_username} price={elem.price} dateForSale={elem.date_for_sale} />)}
            </div>
        </div>

    )
}

export default BookPage