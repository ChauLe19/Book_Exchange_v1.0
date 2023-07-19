import React, { useState } from "react"
import axios from "axios"
import { Button, FormControl, Grid, InputLabel, MenuItem, Select, StepIcon, TextField } from "@material-ui/core"
import { CloseRounded, MonetizationOn } from "@material-ui/icons"


function SellPage(props) {
    const ol_id = props.ol_id
    const imgHref = props.imgHref
    const [price, setPrice] = useState("")
    const [message, setMessage] = useState("")
    const [reload, setReload] = useState(false)
    const [condition, setCondition] = useState("New")
    // if (reload) return (<Redirect to="/user/sell" />)
    return (
        <div style={{ minWidth: "50vw", minHeight: "80vh", textAlign: "center", borderColor: "#273c75", borderStyle: "solid", borderRadius: "1rem", borderWidth: "0.5rem", backgroundColor: "white", color: "#273c75", position: "relative", display: "flex", justifyContent: "center" }}>
            <button style={{ position: "absolute", top: 0, right: 0, aspectRatio: 1, backgroundColor: "transparent", borderWidth: 0 }} onClick={() => props.close()}><CloseRounded /></button>

            <form style={{ padding: "2rem", justifyContent: "center", display: "flex", flexDirection: "column", textAlign: "center", width: "100%" }}>
                <div style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
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
                <div style={{ margin: "1rem" }}>
                    {/* <label for="price">Price:</label> */}
                    <FormControl style={{ width: "50%" }}>

                        <Grid container spacing={1}>
                            <Grid item xs={6}>
                                <InputLabel>Condition</InputLabel>
                                <Select fullWidth
                                    className="shelf-book"
                                    value={condition}
                                    onChange={(e) => setCondition(e.target.value)}
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
                            <Grid item xs={6}>

                                <TextField fullWidth id="price" label="Price" onChange={
                                    e => setPrice(e.target.value)
                                } required />
                            </Grid>
                        </Grid>
                    </FormControl>
                    {/* <input type="text" id="price" name="price" placeholder="Price" value={price} onChange={e => setPrice(e.target.value)} required /> */}
                </div>
                <div>
                    <Button variant="contained" color="primary" type="submit" style={{ backgroundColor: "#44bd32", width: "50%" }} onClick={e => {
                        e.preventDefault()

                        axios.post("http://localhost:2000/sellNewBook", {
                            ol_id: props.ol_id,
                            price: parseFloat(price),
                            condition: condition
                        })
                            .then(() => window.location.reload())
                            .catch(err => { console.log(err.response.data); setMessage(err.response.data) })
                    }}><MonetizationOn /> &nbsp;Sell this book</Button>
                </div>
            </form >
        </div>
    )
}

export default SellPage