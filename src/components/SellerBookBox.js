import React, { Component } from "react"



class SellerBookBox extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div style={{border:"2px black solid"}}>
                <p>Seller: {this.props.sellerUsername}</p>
                 <p>PRICE: ${this.props.price}</p>
                 <p>Date: {this.props.dateForSale}</p>
            </div>
        )
    }
}

export default SellerBookBox