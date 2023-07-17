import React, { useEffect, useState } from "react"
import BookshelfBox from "../components/BookshelfBox"
import { useLocation } from 'react-router-dom'
import InfiniteScroll from "react-infinite-scroller"
import axios from "axios"

function ShelfPage({ inBookshelf }) {
    // const inBookshelf = props.inBookshelf
    // console.log(inBookshelf)
    const shelfQueryLink = inBookshelf ? 'http://localhost:2000/my/bookshelf' : 'http://localhost:2000/my/storeshelf'
    const [shelf, setShelf] = useState([])

    useEffect(() => {
        const loadShelf = () => {
            axios.get(shelfQueryLink)
            .then(data => data.data)
            .then(data => setShelf(data))
        }
        loadShelf()
        return () => {setShelf([])}
    }, [])

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
        <div>
            {
                shelf.map(book =>
                    <BookshelfBox key={book.book_id} inBookshelf={inBookshelf} bookId={book.book_id} date={book.date_created || book.date_for_sale} price={book.price} ol_id={book.ol_id} />
                )}
        </div>
    )
}

export default ShelfPage