import React, { Component } from "react"
import { Redirect } from "react-router-dom"
import { gql } from "@apollo/client";

async function fetchBookData(volumeId){
    return await fetch(`https://www.googleapis.com/books/v1/volumes/${volumeId}`)
        .then(res => res.json())
        .then(data => {if(data.error) throw data.error.message; return data})
        .catch(err => {console.log(err); return false})
}



class FeedBox extends Component {
    constructor(props) {
        super(props)
        this.state={
            imgHref:"",
            title:"",
            subtitle:"",
            reloadFeed:false
        }
    }
    
    componentWillMount(){
        fetchBookData(this.props.volumeIdGG)
        .then(data=>data.volumeInfo)
        .then(({title,subtitle,imageLinks,industryIdentifiers})=>
        this.setState({
            title,
            subtitle,
            imgHref:imageLinks.thumbnail,
            isbn:industryIdentifiers[0].identifier
        })
        )
    }
    
    render() {
        // console.log(this.props)
        if(this.state.reloadFeed) return(<Redirect to="/"/>)
        return (
            <div style={{border:"2px black solid"}}>
                <img src={this.state.imgHref}/>
                <p>Title: {this.state.title}</p>
                <p>Subtitle: {this.state.subtitle}</p>
                <p>ISBN: {this.state.isbn}</p>
                <p>Seller: {this.props.sellerUsername}</p>
                 <p>PRICE: ${this.props.price}</p>
                 <p>Date: {this.props.dateForSale}</p>
                 <button onClick={()=>{
                     this.props.buyBook({
                     variables:{
                         bookId:this.props.bookId
                     }
                 })
                 this.setState({
                     reloadFeed:true
                 })
                }
                 }>Buy this book</button>
            </div>
        )
    }
}

export default FeedBox