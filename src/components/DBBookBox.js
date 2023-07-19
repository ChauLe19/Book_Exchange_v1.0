import axios from "axios"
import React, { Component } from "react"
import Popup from "reactjs-popup"
import SellPage from "../pages/SellPage"
import { Rating } from '@material-ui/lab';
import Button from '@material-ui/core/Button';
import { Icon } from "@material-ui/core";
import AddCircleIcon from '@material-ui/icons/AddCircle';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import { server_url } from "../pages/global_vars";

class DBBookBox extends Component {
    constructor(props) {
        super(props)
        this.state = {
            open: false
        }
    }
    closeModal = () => { console.log("close please", this.state.open); this.setState({ open: false }) }

    render() {
        return (
            <div className={`search-book-box row ${this.props.active ? "active" : ""}`} style={{ padding: "1rem", cursor: "pointer", border: "0.5rem #192a56 solid" }} onClick={this.props.onClick}>
                {/* <div style={{padding:"5px",border: "2px black solid", boxSizing:"border-box"}}> */}

                <div className="col-2" style={{
                    backgroundImage: `url(${this.props.imgHref})`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "contain",
                    backgroundPosition: "center",
                    height: "200px"
                }}></div>
                <div className="col-10" style={{ display: "flex", flexDirection: "column" }}>

                    <h5 style={{ fontWeight: "bold" }}>{this.props.title}</h5>
                    {/* <p>{this.props.subtitle}</p> */}
                    <p>by {(this.props.author || []).join(", ")}</p>
                    {/* <p>Publisher: {this.props.publisher}</p> */}
                    {/* <p>isbn: {(this.props.isbn||[]).join(`, `)}</p> */}
                    {/* <p>Published date: {this.props.publishedDate}</p> */}
                    <div >

                        <Rating name="read-only" value={this.props.rating} precision={0.2} readOnly />
                        <span style={{ verticalAlign: "super" }}>{(this.props.rating || 0).toFixed(2)}</span>
                    </div>
                    <div style={{ flexGrow: "2" }}></div>
                    <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-around" }}>
                        <Button variant="contained" color="primary" style={{ backgroundColor: "#44bd32", margin: "0.5rem", width: "100%" }} onClick={() => this.setState({ open: true })}><MonetizationOnIcon /> &nbsp; Sell</Button>
                        <Popup open={this.state.open} closeOnDocumentClick={false} closeOnEscape={false} modal>
                            <SellPage ol_id={this.props.ol_id} imgHref={this.props.imgHref} title={this.props.title} author={this.props.author} close={this.closeModal}/>
                        </Popup>
                        <Button className="add-to-shelf" variant="outlined" style={{ margin: "0.5rem", width: "100%" }} onClick={() => axios.post(`${server_url}/addBookToShelf`, {
                            ol_id: this.props.ol_id
                        }, {
                            headers: {
                                "Access-Control-Allow-Origin": "*",
                                "Content-Type": "application/json"
                            }
                        }).then(() => console.log("sucess"))
                            .catch(err => console.log(err))
                        }> <AddCircleIcon />&nbsp;Add to shelf</Button>
                    </div>
                </div>
            </div>
        )
    }
}

export default DBBookBox