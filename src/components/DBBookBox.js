import React, { Component } from "react"



class DBBookBox extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className="col-3">
                {/* <div style={{padding:"5px",border: "2px black solid", boxSizing:"border-box"}}> */}

                <div style={{
                    backgroundImage: `url(${this.props.imgHref})`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "contain",
                    backgroundPosition: "center",
                    height: "200px"
                }}></div>
                <p>{this.props.title}</p>
                <p>{this.props.subtitle}</p>
                <p>Author: {(this.props.author || []).join(", ")}</p>
                {/* <p>Publisher: {this.props.publisher}</p> */}
                <p>isbn: {this.props.isbn}</p>
                <p>Published date: {this.props.publishedDate}</p>
                <a href={"/forSaleBooks/" + this.props.volumeIdGG}>Find sellers</a><br /><br />
                {/* </div> */}
            </div>
        )
    }
}

export default DBBookBox