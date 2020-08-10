import React, { useState, useEffect } from "react"
import { useQuery, gql } from "@apollo/client"
import {
    // BrowserRouter as Router,
    // Switch,
    // Route,
    useParams,
    // useRouteMatch,
    // useLocation
} from "react-router-dom"
import SellerBookBox from "../components/SellerBookBox"
// import DBBookBox from "../components/DBBookBox"


const GET_FOR_SALE_BOOKS = gql`
    query getForSaleBooks($volumeIdGG:String){
    searchForSaleBook(volumeIdGG:$volumeIdGG){
        id
        ownedBy{
            username
        }
        dateForSale
        price
    }
    }
`

function BookPage() {
    const { bookId } = useParams();
    console.log(bookId)
    const { data, loading, error } = useQuery(GET_FOR_SALE_BOOKS, {
        variables: {
            volumeIdGG: bookId
        }
    });

    if (loading) return (<p>LOADING... </p>)
    if (error) return (<p>ERROR</p>);
    console.log(data)
    if (!data || data.searchForSaleBook.length === 0) return (<p>There is no one selling this book. Try with another edition of this book or try again at a different time.</p>);
    console.log(data)
    return (
        <div>   
            {data.searchForSaleBook.map(elem => <SellerBookBox key={elem.id} sellerUsername={elem.ownedBy.username} price={elem.price} dateForSale={elem.dateForSale} />)}
        </div>

    )
}

export default BookPage