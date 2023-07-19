import React from "react"
import { useRouteMatch, Switch, Route, useLocation, Link } from "react-router-dom"
import ShelfPage from "./ShelfPage"
import { ArrowBack, ArrowBackIos, ArrowForwardIos } from "@material-ui/icons"

function MyShelves() {
    const match = useRouteMatch()

    return (
        <div>

            <ul className="inline-list shelf-nav" style={{paddingLeft:"0px", alignItems: "center"}}>
                <li>

                    <Link to={`${match.path}/book-shelf`}><ArrowBackIos />&nbsp;My Bookshelf</Link>
                </li>
                    <li style={{fontSize: "2rem"}}>My Shelves</li>
                <li>

                    <Link to={`${match.path}/store-shelf`}>My Storeshelf&nbsp;<ArrowForwardIos /></Link>
                </li>
            </ul>
            <Switch>
                <Route exact path={`${match.path}/book-shelf`}>
                    <ShelfPage key="book-shelf" inBookshelf={true} />
                </Route>
                <Route exact path={`${match.path}/store-shelf`}>
                    <ShelfPage key="store-shelf" inBookshelf={false} />
                </Route>
            </Switch>
        </div>
    )
}

export default MyShelves