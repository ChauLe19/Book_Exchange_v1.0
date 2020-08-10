import React from "react"
import { gql, useQuery } from "@apollo/client"
import BookshelfBox from "../components/BookshelfBox"
// import { useLocation } from 'react-router-dom'
// import RegisterForm from "../components/RegisterForm"
// import LoginForm from "../components/LoginForm"
// import { useRouteMatch, Switch, Route } from "react-router-dom"
// import MyStoreShelf from "./MyStoreShelf"
// import { 
//     BrowserRouter as Router,
//     Switch,
//     Route,
//     useRouteMatch
// } from "react-router-dom"
// import SearchBar from "../components/SearchBar"

const MY_BOOKSHELF = gql`
    query getMyBookShelf{
        myBookShelf{
            id
            dateCreated
            volumeIdGG
    }
}`

function MyBookshelf() {
    const { data, loading, error } = useQuery(MY_BOOKSHELF)
    if(loading) return <p>Loading...</p>
    if(error) return <p>Error</p>
    if(!data||data.length===0) return <p>You have no books in your bookshelf</p>
    return (
        <div>

            {
                data.myBookShelf.map(elem =>
                    <BookshelfBox />
                )
            }
        </div>
    )
}

export default MyBookshelf