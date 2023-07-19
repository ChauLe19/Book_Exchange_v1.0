import React, { Component } from "react"
import { Redirect } from "react-router-dom"
import { fetchBookById, getAppropriateISBN } from "../fetchGGBooks"
import DateDiff from "date-diff"
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { Button, Chip } from "@material-ui/core";
import { ShoppingCart } from "@material-ui/icons";

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
        const allUnits = [diff.years, diff.months, diff.weeks, diff.days, diff.hours, diff.minutes, diff.seconds];
        const allUnitsName = ["yr.", "mos.", "w", "d", "h", "min", "s"];
        for (let i = 0; i < allUnits.length; i++) {
            const diff = allUnits[i]();
            const name = allUnitsName[i];
            if (diff >= 1) {
                return `${Math.floor(diff)}${name} ago`
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
                    ol_id: this.props.ol_id,
                })
            )
    }

    render() {
        if (this.state.reloadFeed) return (<Redirect to="/my/book-shelf" />)
        return (
            <div className="col" style={{ display: "flex", flexDirection: "column", borderRadius: "0.5rem", backgroundColor: "white", padding: "1rem", color: "white", paddingLeft: "2rem", paddingRight: "2rem" }}>
                <p style={{ display: "flex", justifyContent: "space-between", color: "gray" }}><div><AccountCircleIcon /> {this.props.sellerUsername} </div>{this.getDatePosted(new Date(this.props.dateForSale))}</p>
                <div style={{
                    backgroundImage: `url(${this.state.imgHref})`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "contain",
                    backgroundPosition: "center",
                    width: "100%",
                    aspectRatio: "auto",
                    height: "200px",
                    maxHeight: "250px"
                }} >
                </div>
                <div>
                    <b style={{fontSize: "1.2rem", color: "rgb(25, 42, 86)"}}>{this.state.title}<br /> {this.state.subtitle}</b>
                    {/* <p>OLID: {this.state.ol_id}</p> */}
                    <span style={{color: "rgb(25, 42, 86)"}}>By {this.state.author}</span>
                </div>
                <div style={{color: "gray"}}>
                    Condition: {this.props.condition}
                </div>
                <div style={{ display: "flex", flexGrow: 2 }}></div>
                <div style={{ color: "black", fontSize: "1.5rem", textAlign: "center" }}>
                    ${this.props.price}
                </div>
                <div style={{display: "flex", justifyContent: "center"}}>
                
                    <Button variant="contained" color="secondary" style={{ backgroundColor: "#e84118", width: "max-content", marginTop: "0.5rem" }} onClick={() => {
                        this.props.buyBook(this.props.bookId).then((data) => {
                            console.log(data);
                            this.setState({
                                reloadFeed: true
                            })
                        }
                        ).catch(err => alert(err.response.status == 401 ? "Please log in to continue." : err.response.data.error))
                    }}>
                        <ShoppingCart />&nbsp;Buy now
                    </Button>
                </div>
            </div>
        )
    }
}

export default FeedBox