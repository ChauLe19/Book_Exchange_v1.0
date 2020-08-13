import React, { Component } from "react"
import { Redirect } from "react-router-dom"
import { fetchBookById, getAppropriateISBN } from "../fetchGGBooks"

// async function fetchBookData(volumeId){
//     return await fetch(`https://www.googleapis.com/books/v1/volumes/${volumeId}`)
//         .then(res => res.json())
//         .then(data => {if(data.error) throw data.error.message; return data})
//         .catch(err => {console.log(err); return false})
// }



class FeedBox extends Component {
    constructor(props) {
        super(props)
        this.state = {
            imgHref: "",
            title: "",
            subtitle: "",
            error: "",
            reloadFeed: false
        }
    }

    componentWillMount() {
        fetchBookById(this.props.volumeIdGG)
            .then(data => { console.log(data); return data.volumeInfo })
            .then(({ title, subtitle, imageLinks, industryIdentifiers }) =>
                this.setState({
                    title,
                    subtitle,
                    imgHref: imageLinks.thumbnail,
                    isbn: getAppropriateISBN(industryIdentifiers)
                })
            )
    }

    render() {
        // console.log(this.props)
        if (this.state.reloadFeed) return (<Redirect to="/my/book-shelf" />)
        return (
            <div className="row" style={{ border: "2px black solid", margin: "10px" }}>
                <div className="col-4 horizontal-center">
                    <img src={this.state.imgHref} style={{ height: "100%" }} />
                </div>
                <div className="col-8">

                    <p>Title: {this.state.title}<br /> {this.state.subtitle}</p>
                    <p>ISBN: {this.state.isbn}</p>
                    <p>Seller: {this.props.sellerUsername}</p>
                    <p>Date: {this.props.dateForSale}</p>
                    <p>PRICE: ${this.props.price}</p>
                    <p style={{ color: "red" }}>{this.state.error}</p>
                    <button onClick={() => {
                        this.props.buyBook({
                            variables: {
                                bookId: this.props.bookId
                            }
                        }).then(() =>
                            this.setState({
                                reloadFeed: true
                            })
                        ).catch(err => this.setState({ error: err.toString() }))
                    }
                    }>Buy this book</button>
                </div>
            </div>
        )
    }
}

export default FeedBox