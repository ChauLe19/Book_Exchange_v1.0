import React, { useEffect, useState } from "react"
import { gql, useQuery, useMutation } from "@apollo/client"
import BookshelfBox from "../components/BookshelfBox"
import { useLocation } from 'react-router-dom'
import InfiniteScroll from "react-infinite-scroller"

const MY_BOOKSHELF = gql`
    query getMyBookShelf($cursorId:Int){
        myBookShelf(cursorId:$cursorId,take:3){
            cursorId
            isNotEmpty
            results{
                id
                volumeIdGG
                dateCreated
            }
        }
    }`

const MY_STORESHELF = gql`
    query getMyStoreShelf($cursorId:Int){
        myStoreShelf(cursorId:$cursorId, take:3){
            cursorId
            isNotEmpty
            results{
                id
                volumeIdGG
                dateForSale
                price
            }
        }
    }`


const SELL_EXIST_BOOK = gql`
    mutation sellExistBook($bookId:ID!, $price:Float!){
        sellExistBook(bookId:$bookId,price:$price){
            id
        }
    }
`
const UNSELL = gql`
    mutation unsell($bookId:ID!){
        unsell(bookId:$bookId){
            id
        }
    }
`


function ShelfPage({ inBookshelf }) {
    // const inBookshelf = props.inBookshelf
    // console.log(inBookshelf)
    const shelfQuery = inBookshelf ? MY_BOOKSHELF : MY_STORESHELF
    const shelfMutation = inBookshelf ? SELL_EXIST_BOOK : UNSELL
    const { data, loading, error, fetchMore, refetch } = useQuery(shelfQuery)
    const [prevCursor, setPrevCursor] = useState(null)
    const [shelfMutate] = useMutation(shelfMutation)
    useEffect(() => {
        refetch()
    }, [])
    if (loading) return <p>Loading...</p>
    if (error) return <p>{error.toString()}</p>
    if (!data || data.length === 0) return <p>You have no books in this shelf</p>
    const whichShelf = inBookshelf ? "myBookShelf" : "myStoreShelf";
    let shelf = data[whichShelf]
    function handleLoadMore() {
        if (data[whichShelf].cursorId === prevCursor) {
            return
        } else {
            setPrevCursor(data[whichShelf].cursorId)
            console.log("load more")
        }
        fetchMore({
            variables: {
                cursorId: data[whichShelf].cursorId,
            },
            updateQuery: (prev, { fetchMoreResult, ...rest }) => {
                if (!fetchMoreResult) return prev;
                // console.log(fetchMoreResult)
                const returnResult = {
                    ...fetchMoreResult,
                    
                };
                returnResult[whichShelf]={
                    ...fetchMoreResult[whichShelf],
                    results: [
                        ...prev[whichShelf].results,
                        ...fetchMoreResult[whichShelf].results,
                    ],
                };
                return returnResult
            },
        })
    }

    console.log(data[whichShelf].results )
    return (
        // <div className="row">
        //     {data[whichShelf].isNotEmpty && (
        //         <button
        //             onClick={() => {

        //                 fetchMore({
        //                     variables: {
        //                         cursorId: data[whichShelf].cursorId,
        //                     },
        //                     updateQuery: (prev, { fetchMoreResult, ...rest }) => {
        //                         if (!fetchMoreResult) return prev;
        //                         // console.log(fetchMoreResult)
        //                         const data = {
        //                             ...fetchMoreResult,
        //                         };
        //                         data[whichShelf] = {
        //                             ...(fetchMoreResult.myBookShelf || fetchMoreResult.myStoreShelf),
        //                             results: [
        //                                 ...(prev.myBookShelf || prev.myStoreShelf).results,
        //                                 ...(fetchMoreResult.myBookShelf || fetchMoreResult.myStoreShelf).results,
        //                             ],
        //                         }

        //                         return data
        //                     },
        //                 })
        //             }
        //             }
        //         >
        //             Load More
        //         </button>
        //     ) || (
        //             <p>This is the end</p>
        //         )
        //     }
        // </div>

        // <div className="row">

        <InfiniteScroll className="row"
            loadMore={handleLoadMore}
            hasMore={data[whichShelf].isNotEmpty}
            loader={<p>Loading...</p>}>
            {
                data[whichShelf].results.map(book =>
                    <BookshelfBox key={book.id} inBookshelf={inBookshelf} bookId={book.id} date={book.dateCreated || book.dateForSale} price={book.price} volumeIdGG={book.volumeIdGG} shelfMutation={shelfMutate} />
                    )
                }

        </InfiniteScroll>
                // </div>
    )
}

export default ShelfPage