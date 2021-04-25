import React, {Component, Fragment} from 'react'

//Router import for redirection.
import {Route, Switch} from "react-router-dom";

//Imports of different pages in the application
import Login from "./screens/login/Login";
import Home from "./screens/home/Home";
import Profile from "./screens/profile/Profile";

/**
 * This class represents the whole ImageViewer Application.
 */
class ImageViewer extends Component {
    render() {
        return <Fragment>
            <Switch>
                <Route exact path='/' render={(props) => <Login {...props}/>}/>
                <Route exact path='/home' render={(props) => <Home {...props}/>}/>
                <Route exact path='/profile' render={(props) => <Profile {...props}/>}/>
            </Switch>
        </Fragment>
    }
}

export default ImageViewer;