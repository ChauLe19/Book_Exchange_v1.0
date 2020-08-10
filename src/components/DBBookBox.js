import React, { Component } from "react"



class DBBookBox extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div style={{ border: "2px black solid" }}>
                <img src={this.props.imgHref} width={"64"} height={"128"} />
                <p>{this.props.title}</p>
                <p>{this.props.subtitle}</p>
                <p>Author: {(this.props.author||[]).join(", ")}</p>
                <p>Publisher: {this.props.publisher}</p>
                <p>isbn: {this.props.isbn}</p>
                <p>Published date: {this.props.publishedDate}</p>
                <a href={"/forSaleBooks/"+this.props.volumeIdGG}>Find sellers</a><br /><br />
            </div>
        )
    }
}

export default DBBookBox