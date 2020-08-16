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
                    imgHref: imageLinks ? imageLinks.thumbnail : "https://islandpress.org/sites/default/files/default_book_cover_2015.jpg",
                    isbn: getAppropriateISBN(industryIdentifiers)
                })
            )
    }

    render() {
        // console.log(this.props)
        if (this.state.reloadFeed) return (<Redirect to="/my/book-shelf" />)
        return (
            <div className="row" style={{ border: "2px black solid", margin: "10px 20px 10px 20px", }}>
                <div className="col-4 horizontal-center" style={{
                    backgroundImage: `url(${this.state.imgHref})`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize:"contain",
                    backgroundPosition:"center"
                }}>

                </div>
                <div className="col-8">

                    <p>Title: {this.state.title}<br /> {this.state.subtitle}</p>
                    <p>ISBN: {this.state.isbn}</p>
                    <p>Seller: {this.props.sellerUsername}</p>
                    <p>Date: {this.props.dateForSale}</p>
                    <p className="error">{this.state.error}</p>
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
                    <span style={{color:"green", fontSize:"1.5em"}}> ${this.props.price}</span>
                    <p></p>
                </div>
            </div>
        )
    }
}

export default FeedBox