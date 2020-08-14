import React, { Component } from "react"
import { fetchBookById, getAppropriateISBN } from "../fetchGGBooks"
import { Redirect } from "react-router-dom"



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
        fetchBookById(this.props.volumeIdGG)
            .then(data => data.volumeInfo)
            .then(({ imageLinks, title, industryIdentifiers }) => this.setState({
                title,
                imgHref: imageLinks ? imageLinks.thumbnail : "https://islandpress.org/sites/default/files/default_book_cover_2015.jpg",
                isbn: getAppropriateISBN(industryIdentifiers)
            }))
    }

    render() {
        if (this.state.reload) return (<Redirect to={this.props.inBookshelf ? "/my/book-shelf" : "/my/store-shelf"} />)
        return (
            <div className="col-4 horizontal-center" style={{}}>
                <div style={{margin:"5px",border:"black 2px solid"}} >

                <div className="horizontal-center" style={{
                    height:"200px",
                    backgroundImage: `url(${this.state.imgHref})`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize:"contain",
                    backgroundPosition:"center"
                }}>
                </div>
                <p>{this.state.title}</p>
                <p>isbn: {this.state.isbn}</p>
                {this.props.inBookshelf || <p>Price: ${this.props.price}</p>}
                <p>{this.props.inBookshelf ? "Created date: " : "For sale date:"} {this.props.date}</p>
                {this.props.inBookshelf && <input type="input" value={this.state.value} placeholder="price" onChange={(e) => this.setState({ price: e.target.value })} />}
                <button onClick={() => {
                    this.props.shelfMutation({
                        variables: {
                            price: parseFloat(this.state.price),
                            bookId: this.props.bookId
                        }
                    })
                    this.setState({ reload: true })
                }}>{this.props.inBookshelf ? "Sell" : "Unsell"}</button>
                </div>
            </div>
        )
    }
}

export default BookshelfBox