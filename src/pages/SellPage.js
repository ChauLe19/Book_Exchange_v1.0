import React, { useState } from "react"
import {
    useMutation,
    gql
} from "@apollo/client"

const SELL_BOOK = gql`
mutation sellNewBook($volumeIdGG:String!, $price:Float!){
    sellNewBook(volumeIdGG:$volumeIdGG,price:$price){
        forSale
  }
}`



function SellPage() {
    const [sellBook] = useMutation(SELL_BOOK)

    const [isbn, setISBN] = useState("")
    const [price, setPrice] = useState("")
    const [message, setMessage] = useState("")
    const [reload, setReload] = useState(false)
    // if (reload) return (<Redirect to="/user/sell" />)
    return (
        <div style={{ textAlign: "center" }}>

            <form>
                <label for="isbn">ISBN:</label>
                <input type="text" id="isbn" name="isbn" value={isbn} onChange={e => setISBN(e.target.value)} required />
                <label for="price">price:</label>
                <input type="text" id="price" name="price" value={price} onChange={e => setPrice(e.target.value)} required />
                <input type="submit" onClick={e => {
                    e.preventDefault()
                    fetch("https://www.googleapis.com/books/v1/volumes?q=isbn:" + isbn)
                        .then(res => res.json())
                        .then(data => {
                            const volumeIdGG = data.items[0].id
                            sellBook({
                                variables: {
                                    volumeIdGG,
                                    price: parseFloat(price)
                                }
                            }).then(()=>
                                window.location.reload()
                            )
                                .catch(err => {console.log(err);setMessage(err.toString())})
                        })
                        .catch(err => setMessage("Invalid isbn"))
                }} value="Sell this book" />
                <p className="error">{message}</p>
            </form >
        </div>
    )
}

export default SellPage