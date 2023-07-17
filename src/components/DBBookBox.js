import axios from "axios"
import React, { Component } from "react"
import Popup from "reactjs-popup"
import SellPage from "../pages/SellPage"



class DBBookBox extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className="row" style={{margin: "1rem"}}>
                {/* <div style={{padding:"5px",border: "2px black solid", boxSizing:"border-box"}}> */}

                <div className="col-2" style={{
                    backgroundImage: `url(${this.props.imgHref})`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "contain",
                    backgroundPosition: "center",
                    height: "200px"
                }}></div>
                <div className="col-10">

                    <h4 style={{fontWeight: "bold"}}>{this.props.title}</h4>
                    {/* <p>{this.props.subtitle}</p> */}
                    <p>by {(this.props.author || []).join(", ")}</p>
                    {/* <p>Publisher: {this.props.publisher}</p> */}
                    {/* <p>isbn: {(this.props.isbn||[]).join(`, `)}</p> */}
                    {/* <p>Published date: {this.props.publishedDate}</p> */}
                    <a href={"/forSaleBooks/" + this.props.id}>Buy</a>
                    <Popup trigger={<button>Sell</button>} modal>
                        <SellPage ol_id={this.props.ol_id} imgHref={this.props.imgHref} title={this.props.title} author={this.props.author} />
                    </Popup>
                    <button onClick={() => axios.post("http://localhost:2000/addBookToShelf", {
                        ol_id: this.props.ol_id
                    }, {
                        headers: {
                            "Access-Control-Allow-Origin": "*",
                            "Content-Type": "application/json"
                        }
                    }).then(() => console.log("sucess"))
                        .catch(err => console.log(err))}>Add to bookshelf</button>
                    <br /><br />
                    {/* </div> */}
                </div>
            </div>
        )
    }
}

export default DBBookBox