import React from "react"
import { useRouteMatch, Switch, Route, useLocation, Link } from "react-router-dom"
import ShelfPage from "./ShelfPage"

function MyShelves() {
    const match = useRouteMatch()

    return (
        <div>

            <ul>
                <li>

                    <Link to={`${match.path}/book-shelf`}>My Bookshelf</Link>
                </li>
                <li>

                    <Link to={`${match.path}/store-shelf`}>My Storeshelf</Link>
                </li>
            </ul>
            <Switch>
                <Route exact path={`${match.path}/book-shelf`}>
                    <ShelfPage key="book-shelf" inBookshelf={true}/>
                </Route>
                <Route exact path={`${match.path}/store-shelf`}>
                    <ShelfPage key="store-shelf" inBookshelf={false}/>
                </Route>
            </Switch>
        </div>
    )
}

export default MyShelves