import React, { Component } from "react"
import { Redirect } from "react-router-dom"
import { fetchBookById, getAppropriateISBN } from "../fetchGGBooks"
import DateDiff from "date-diff"

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

    getDatePosted(date) {
        const now = new Date();
        const diff = new DateDiff(now, date)
        const allUnits = [diff.years, diff.months, diff.days, diff.weeks, diff.hours, diff.minutes, diff.seconds];
        const allUnitsName = ["years", "months", "days", "weeks", "hours", "minutes", "seconds"];
        for (let i = 0; i < allUnits.length; i++) {
            const diff = allUnits[i]();
            const name = allUnitsName[i];
            if (diff >= 1) {
                return `${Math.floor(diff)} ${name} ago`
            }
        }
        return "0 seconds ago";
    }

    componentWillMount() {
        console.log(this.props)
        fetchBookById(this.props.ol_id)
            .then(({ title, description, covers, author }) =>
                this.setState({
                    title,
                    subtitle: "",
                    author,
                    imgHref: covers && covers.length > 0 ? `http://covers.openlibrary.org/b/ID/${covers[0]}-M.jpg` : "https://islandpress.org/sites/default/files/default_book_cover_2015.jpg",
                    ol_id: this.props.ol_id
                })
            )
    }

    render() {
        if (this.state.reloadFeed) return (<Redirect to="/my/book-shelf" />)
        return (
            <div className="col" style={{ display: "flex", flexDirection: "column", border: "2px black solid" }}>
                <p style={{ display: "flex", justifyContent: "space-between" }}><div>Seller: {this.props.sellerUsername} </div>{this.getDatePosted(new Date(this.props.dateForSale))}</p>
                <div style={{
                    backgroundImage: `url(${this.state.imgHref})`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "contain",
                    backgroundPosition: "center",
                    width: "100%",
                    aspectRatio: "auto",
                    height: "200px",
                    maxHeight: "200px"
                }} >

                </div>
                <div>
                    <b>{this.state.title}<br /> {this.state.subtitle}</b>
                    {/* <p>OLID: {this.state.ol_id}</p> */}
                    <span>By {this.state.author}</span>
                </div>
                <div style={{ display: "flex", flexGrow: 2 }}></div>
                <div style={{ color: "green", fontSize: "1.5em", textAlign: "center" }}>
                    <b> ${this.props.price}</b>
                </div>
                <button style={{ width: "100%" }} onClick={() => {
                    this.props.buyBook(this.props.bookId).then((data) =>{
                        console.log(data);
                        this.setState({
                            reloadFeed: true
                        })}
                    ).catch(err => alert(err.response.status == 401 ? "Please log in to continue." : err.response.data.error))
                }
                }>Buy this book</button>
                <p></p>
            </div>
        )
    }
}

export default FeedBox