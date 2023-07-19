import { Button } from "@material-ui/core"
import { ShoppingCart } from "@material-ui/icons"
import axios from "axios"
import React, { Component } from "react"


async function buyBook(bookId) {
    return await axios.post(`http://localhost:2000/book/${bookId}/buy`)
}

class SellerBookBox extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className="row" style={{ border: "2px #192A56 solid", padding: "1rem", borderWidth: "0.25rem 0 0.25rem" }}>
                <div className="col-8">
                    <p>Seller: {this.props.sellerUsername}</p>
                    <p>Condition: Like-new</p>
                    <p>Posted: {new Date(this.props.dateForSale).toLocaleDateString('en-us', { day: "numeric", year: "numeric", month: "short" })}</p>
                </div>
                <div className="col-4" style={{textAlign: "right", display: "flex", flexDirection: "column"}}>
                    <div style={{flexGrow: 1}}></div>
                    <div style={{fontWeight: 700, fontSize: "1.2rem"}}>${this.props.price}</div>
                    <Button variant="contained" color="secondary" style={{ backgroundColor: "#e84118", color: "white", margin: "0.5rem", width: "100%" }} onClick={() => buyBook(this.props.book_id) && window.location.reload()}><ShoppingCart /> &nbsp; Buy now</Button>
                </div>
            </div>
        )
    }
}

export default SellerBookBox