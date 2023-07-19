import React, { Fragment, useState, useEffect } from "react";
import SellerBookBox from "../components/SellerBookBox"
import { Redirect } from "react-router-dom";
import FeedBox from "../components/FeedBox";
import InfiniteScroll from "react-infinite-scroller";
import SellPage from "./SellPage"
import axios from "axios";
import { server_url } from "../pages/global_vars";


async function buyBook(bookId) {
    return await axios.post(`${server_url}/book/${bookId}/buy`)
}

function Home(props) {
    const [prevCursor, setPrevCursor] = useState(null)
    const [data, setData] = useState([])

    useEffect(() => {
        axios.get(`${server_url}/feed`, {
        })
            .then(data => data.data)
            .then(data => setData(data))
    }, [])

    return (

        <div style={{backgroundColor: "rgb(25, 42, 86)", flexGrow: 2}}>

            <div style={{ width: "90%", margin: "auto", display: "grid", gap: "1rem", boxSizing: "border-box", padding: "1rem", gridTemplateColumns: "repeat(4,1fr)" }}>

                {/* <InfiniteScroll
                loadMore={handleLoadMore}
                hasMore={data.feed.isNotEmpty}
                loader={<p key="loading">Loading...</p>}> */}
                {data.map(elem => <FeedBox key={elem.book_id}
                    bookId={elem.book_id}
                    ol_id={elem.ol_id}
                    sellerUsername={elem.owner_username}
                    price={elem.price}
                    dateForSale={elem.date_for_sale}
                    condition={elem.book_condition}
                    buyBook={buyBook}
                />
                )}
                {/* </InfiniteScroll> */}
                {/* {!data.feed.isNotEmpty && <p>This is the end</p>} */}
            </div>
        </div>
    );
}

export default Home;