import React, { Fragment, useState, useEffect } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";
import SellerBookBox from "../components/SellerBookBox"
import { Redirect } from "react-router-dom";
import FeedBox from "../components/FeedBox";

// import { LaunchTile, Header, Button, Loading } from "../components";

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
    const [buyBook, {buyBookData}] = useMutation(BUY_BOOK);

    // console.log(buyBookData)
    // const [message, setMessage] = useState("")
    // console.log(props)

    useEffect(() => {
        refetch()
    }, [])
    if (loading) return (<p>LOADING... </p>)
    if (error) return (<p>ERROR</p>);
    if (!data) return (<p>Not found</p>);


    // console.log(data)
    if (!data.feed.isNotEmpty && !data.feed.cursorId) {
        return <p>Noone has posted anything be the first one!</p>
    }
    // `id:${elem.id} price:${elem.price}, volumeIdGG: ${elem.volumeIdGG}`
    return (
        <Fragment>
            {data.feed.results.map(elem => <FeedBox key={elem.id}
                    bookId={elem.id}
                    volumeIdGG={elem.volumeIdGG}
                    sellerUsername={elem.ownedBy.username}
                    price={elem.price}
                    dateForSale={elem.dateForSale}
                    buyBook={buyBook}
                     />
            )}
            {data.feed &&
                data.feed.isNotEmpty && (
                    <button
                        onClick={() =>
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
                    >
                        Load More
                    </button>
                ) || (
                    <p>This is the end</p>
                )
            }
        </Fragment>
    );
}

export default Home;