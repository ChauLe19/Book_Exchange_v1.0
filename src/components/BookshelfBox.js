import React, { Component } from "react"
import { fetchBookById, getAppropriateISBN } from "../fetchGGBooks"
import { Redirect } from "react-router-dom"
import axios from "axios"



class BookshelfBox extends Component {
    constructor(props) {
        super(props)
        this.state = {
            imgHref: "",
            title: "",
            isbn: "",
            price: "",
            reload: false
        }
    }

    componentWillMount() {
        fetchBookById(this.props.ol_id)
            .then(({ covers, title, ol_id }) => this.setState({
                title,
                imgHref: covers && covers.length > 0 ? `http://covers.openlibrary.org/b/ID/${covers[0]}-M.jpg` : "https://islandpress.org/sites/default/files/default_book_cover_2015.jpg",
                ol_id
            }))
    }

    render() {
        if (this.state.reload) return (<Redirect to={this.props.inBookshelf ? "/my/book-shelf" : "/my/store-shelf"} />)
        return (
            <div className="col-4 horizontal-center" style={{}}>
                <div style={{ margin: "5px", border: "black 2px solid" }} >

                    <div className="horizontal-center" style={{
                        height: "200px",
                        backgroundImage: `url(${this.state.imgHref})`,
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "contain",
                        backgroundPosition: "center"
                    }}>
                    </div>
                    <p>{this.state.title}</p>
                    <p>OLID: {this.state.ol_id}</p>
                    {this.props.inBookshelf || <p>Price: ${this.props.price}</p>}
                    <p>{this.props.inBookshelf ? "Created date: " : "For sale date:"} {this.props.date}</p>
                    {this.props.inBookshelf && <input type="input" value={this.state.value} placeholder="price" onChange={(e) => this.setState({ price: e.target.value })} />}
                    <button onClick={() => {
                        axios.post(this.props.inBookshelf ? `http://localhost:2000/book/${this.props.bookId}/sell` : `http://localhost:2000/book/${this.props.bookId}/unsell`, {
                            price: parseFloat(this.state.price)
                        }, {
                            headers: {
                                "Access-Control-Allow-Origin": "*",
                                "Content-Type": "application/json"
                            }
                        }).then(data => this.setState({ reload: true }))
                    }}>{this.props.inBookshelf ? "Sell" : "Unsell"}</button>
                    <button onClick={() => {
                        axios.post(`http://localhost:2000/book/${this.props.bookId}/delete`, {
                            price: parseFloat(this.state.price)
                        }, {
                            headers: {
                                "Access-Control-Allow-Origin": "*",
                                "Content-Type": "application/json"
                            }
                        }).then(data => this.setState({ reload: true }))
                    }}>Delete</button>
                </div>
            </div>
        )
    }
}

export default BookshelfBox