import React, { Component } from "react"
import { fetchBookById, getAppropriateISBN } from "../fetchGGBooks"
import { Redirect } from "react-router-dom"
import axios from "axios"
import { Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField } from "@material-ui/core"
import { Close, Delete, MonetizationOn } from "@material-ui/icons"
import { Fragment } from "react"
import { server_url } from "../pages/global_vars";



class BookshelfBox extends Component {
    constructor(props) {
        super(props)
        this.state = {
            imgHref: "",
            title: "",
            isbn: "",
            price: "",
            reload: false,
            active: false,
            condition: ''
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
            <div className="col-3 horizontal-center" style={{}}>
                <div style={{ margin: "5px", padding: "2rem" }} >

                    <div className={`book${this.state.active ? " active" : ""}`} style={{
                        width: "max-content",
                        height: "max-content",
                        margin: "auto"
                    }}>
                        <div className="overlay" style={{ position: "absolute", top: 0, bottom: 0, right: 0, left: 0, flexDirection: "column", justifyContent: "center", padding: "1rem", color: "#192a56" }}>
                            <button style={{ position: "absolute", right: 0, top: 0, width: "25px", height: "25px", display: "flex", justifyContent: "center", backgroundColor: "transparent", borderWidth: 0 }} onClick={() => {
                                this.setState({ active: false })
                            }}><Close /> </button>
                            <b style={{ fontSize: "1.2rem" }}>{this.state.title}</b>
                            {this.props.inBookshelf ?
                                //bookshelf
                                <Fragment>
                                    <p>Created: {new Date(this.props.date).toLocaleDateString('en-us', { day: "numeric", year: "numeric", month: "short" })}</p>
                                    <FormControl>
                                        <Grid container spacing={1}>
                                            <Grid item xs={7}>
                                                <InputLabel>Condition</InputLabel>
                                                <Select fullWidth
                                                    className="shelf-book"
                                                    value={this.state.condition}
                                                    onChange={(e) => this.setState({ condition: e.target.value })}
                                                    style={{
                                                        textAlign: "left"
                                                    }}
                                                >
                                                    <MenuItem value={"New"}>New</MenuItem>
                                                    <MenuItem value={"Like-new"}>Like-new</MenuItem>
                                                    <MenuItem value={"Very good"}>Very good</MenuItem>
                                                    <MenuItem value={"Good"}>Good</MenuItem>
                                                    <MenuItem value={"Fair"}>Fair</MenuItem>
                                                    <MenuItem value={"Poor"}>Poor</MenuItem>
                                                </Select>
                                            </Grid>
                                            <Grid item xs={5}>
                                                <TextField id="price" label="Price"
                                                    inputProps={{
                                                        max: 999999.99, min: 0.0,
                                                        maxLength: 9
                                                    }}
                                                    onInput={(e) => {
                                                        if(isNaN(e.target.value))
                                                        {
                                                            e.target.value = e.target.value.slice(0, e.target.value.length - 1)
                                                        }
                                                        else if(parseFloat(e.target.value) > 999999.99 )
                                                        {
                                                            e.target.value = parseFloat(e.target.value).toString().slice(0,6)
                                                        }
                                                    }}
                                                    onChange={
                                                        e => this.setState({ price: e.target.value })
                                                    } required />
                                            </Grid>
                                        </Grid>
                                    </FormControl>
                                </Fragment>
                                :
                                // storeshelf
                                <div>
                                    <div>Price: ${this.props.price}</div>
                                    <div>
                                        Condition: {this.props.condition}
                                    </div>
                                    <div>
                                        For sale: {new Date(this.props.date).toLocaleDateString('en-us', { day: "numeric", year: "numeric", month: "short" })}
                                    </div>


                                </div>
                            }
                            <div style={{ flexGrow: 1 }}></div>
                            <Button variant="contained" color="primary" type="submit" style={{ backgroundColor: "#44bd32", margin: "0.25rem" }} onClick={() => {
                                axios.post(this.props.inBookshelf ? `${server_url}/book/${this.props.bookId}/sell` : `${server_url}/book/${this.props.bookId}/unsell`, {
                                    price: parseFloat(this.state.price),
                                    condition: this.state.condition
                                }, {
                                    headers: {
                                        "Access-Control-Allow-Origin": "*",
                                        "Content-Type": "application/json"
                                    }
                                }).then(data => this.setState({ reload: true }))
                            }}><MonetizationOn />&nbsp;{this.props.inBookshelf ? "Sell" : "Unsell"}</Button>

                            <Button variant="contained" color="primary" style={{ backgroundColor: "#c23616", margin: "0.25rem" }} onClick={() => {
                                axios.post(`${server_url}/book/${this.props.bookId}/delete`, {
                                    price: parseFloat(this.state.price),
                                    condition: this.state.condition
                                }, {
                                    headers: {
                                        "Access-Control-Allow-Origin": "*",
                                        "Content-Type": "application/json"
                                    }
                                }).then(data => this.setState({ reload: true }))
                            }}><Delete /> &nbsp;Delete</Button>
                        </div>
                        <div className="corner" onClick={() => {
                            console.log("trigger")
                            this.setState({ active: true })
                        }}></div>
                        <img src={this.state.imgHref} style={{ height: "350px", boxShadow: "30px 30px 30px rgb(0 0 0 / 0.4)" }} />
                    </div>
                </div>
            </div>
        )
    }
}

export default BookshelfBox