import React, { useState, useEffect } from "react"
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
// import DBBookBox from "../components/DBBookBox"
//
function BookPage() {
    const { OL_ID } = useParams();
    const [forSaleBooks, setForSaleBooks] = useState([])

    useEffect(() => {
        const loadBooks = () => {
            axios.get(`http://localhost:2000/forSale/${OL_ID}`)
                .then(data => data.data)
                .then(data => setForSaleBooks(data))
        }
        loadBooks()
        return () => {setForSaleBooks([])}
    },[])

    if (!forSaleBooks || forSaleBooks.length === 0) return (<p>There is no one selling this book. Try with another edition of this book or try again at a different time.</p>);
    // console.log(forSaleBooks)
    return (
        <div>   
            {forSaleBooks.map(elem => <SellerBookBox key={elem.id} sellerUsername={elem.owner_username} price={elem.price} dateForSale={elem.date_for_sale} />)}
        </div>

    )
}

export default BookPage