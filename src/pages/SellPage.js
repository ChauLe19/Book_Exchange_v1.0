import React, { useState } from "react"
import axios from "axios"


function SellPage(props) {
    const ol_id = props.ol_id
    const imgHref = props.imgHref
    const [price, setPrice] = useState("")
    const [message, setMessage] = useState("")
    const [reload, setReload] = useState(false)
    // if (reload) return (<Redirect to="/user/sell" />)
    return (
        <div style={{ width: "100%", height: "100%", textAlign: "center", borderColor: "blue", borderStyle: "groove", borderRadius:"2rem", borderWidth:"1rem"}}>

            <form style={{padding: "2rem"}}>
                <div>
                    {props.title}
                </div>
                <div>
                    By {props.author}
                </div>
                <div style={{
                    backgroundImage: `url(${props.imgHref})`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "contain",
                    backgroundPosition: "center",
                    height: "200px"
                }}></div>
                <div>
                    <label for="price">Price:</label>
                    <input type="text" id="price" name="price" value={price} onChange={e => setPrice(e.target.value)} required />
                </div>
                <input type="submit" onClick={e => {
                    e.preventDefault()

                    axios.post("http://localhost:2000/sellNewBook", {
                        ol_id: props.ol_id,
                        price: parseFloat(price)
                    })
                        .then(() => window.location.reload())
                        .catch(err => { console.log(err.response.data); setMessage(err.response.data) })
                }} value="Sell this book" />
                <p className="error">{message}</p>
            </form >
        </div>
    )
}

export default SellPage