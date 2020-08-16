import React, { Fragment, useState, useEffect } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";
import SellerBookBox from "../components/SellerBookBox"
import { Redirect } from "react-router-dom";
import FeedBox from "../components/FeedBox";
import InfiniteScroll from "react-infinite-scroller";
import SellPage from "./SellPage"


const GET_POSTS = gql`
  query feed($cursorId:Int,$take:Int){
    feed(cursorId:$cursorId, take:$take){
        cursorId
    isNotEmpty
    results{
      id
      price
      dateForSale
    	volumeIdGG
      ownedBy{username}
    }
    
  }
    }   
`;

const BUY_BOOK = gql`
    mutation buy($bookId:ID!){
        buy(bookId:$bookId){
            date
            seller{
            username
            }
            buyer{
            username
            }
        }
    }
`

function Home(props) {
    const { data, loading, error, fetchMore, refetch } = useQuery(GET_POSTS);
    const [buyBook, { buyBookData }] = useMutation(BUY_BOOK);
    const [prevCursor, setPrevCursor] = useState(null)

    useEffect(() => {
        // window.addEventListener("scroll",FETCH_MORE)
        refetch()

        // return ()=> window.removeEventListener("scroll",FETCH_MORE)
    }, [])
    if (loading) return (<p>LOADING... </p>)
    if (error) return (<p>{error.toString()}</p>);
    if (!data) return (<p>Not found</p>);


    function handleLoadMore() {
        if (data.feed.cursorId === prevCursor) {
            return
        } else {
            setPrevCursor(data.feed.cursorId)
            console.log("load more")
        }
        fetchMore({
            variables: {
                cursorId: data.feed.cursorId,
            },
            updateQuery: (prev, { fetchMoreResult, ...rest }) => {
                if (!fetchMoreResult) return prev;
                console.log(fetchMoreResult)
                return {
                    ...fetchMoreResult,
                    feed: {
                        ...fetchMoreResult.feed,
                        results: [
                            ...prev.feed.results,
                            ...fetchMoreResult.feed.results,
                        ],
                    },
                };
            },
        })
    }
    if (!data.feed.isNotEmpty && !data.feed.cursorId) {
        return <p>Noone has posted anything be the first one!</p>
    }
    return (
        // <Fragment>
        //     {data.feed.results.map(elem => <FeedBox key={elem.id}
        //         bookId={elem.id}
        //         volumeIdGG={elem.volumeIdGG}
        //         sellerUsername={elem.ownedBy.username}
        //         price={elem.price}
        //         dateForSale={elem.dateForSale}
        //         buyBook={buyBook}
        //     />
        //     )}
        //     {data.feed.isNotEmpty && (
        //         <button
        //             onClick={() =>
        //                 fetchMore({
        //                     variables: {
        //                         cursorId: data.feed.cursorId,
        //                     },
        //                     updateQuery: (prev, { fetchMoreResult, ...rest }) => {
        //                         if (!fetchMoreResult) return prev;
        //                         console.log(fetchMoreResult)
        //                         return {
        //                             ...fetchMoreResult,
        //                             feed: {
        //                                 ...fetchMoreResult.feed,
        //                                 results: [
        //                                     ...prev.feed.results,
        //                                     ...fetchMoreResult.feed.results,
        //                                 ],
        //                             },
        //                         };
        //                     },
        //                 })
        //             }
        //         >
        //             Load More
        //         </button>
        //     ) || (
        //             <p>This is the end</p>
        //         )
        //     }
        // </Fragment>
        <Fragment>

        <SellPage />
            <InfiniteScroll
                loadMore={handleLoadMore}
                hasMore={data.feed.isNotEmpty}
                loader={<p key="loading">Loading...</p>}>
                {data.feed.results.map(elem => <FeedBox key={elem.id}
                    bookId={elem.id}
                    volumeIdGG={elem.volumeIdGG}
                    sellerUsername={elem.ownedBy.username}
                    price={elem.price}
                    dateForSale={elem.dateForSale}
                    buyBook={buyBook}
                />
                )}
            </InfiniteScroll>
            {!data.feed.isNotEmpty && <p>This is the end</p>}
        </Fragment>
    );
}

export default Home;