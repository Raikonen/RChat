import React from 'react';
import ReactDOM from 'react-dom';
import { Route, Redirect, BrowserRouter as Router } from 'react-router-dom';
import * as serviceWorker from './serviceWorker';

import Login from './components/login/login';
import Signup from './components/signup/signup';
import Dashboard from './components/dashboard/dashboard';
import 'bootstrap/dist/css/bootstrap.css';
import './index.css';


import Firebase, { FirebaseContext } from './components/firebase/';


ReactDOM.render(
    <FirebaseContext.Provider value={new Firebase()}>
            <Router>
                <div>
                    <Route exact path="/" render={() => (
                        <Redirect to="/dashboard"/>
                    )}/>
                    <Route path="/login" component={Login}></Route>
                    <Route path="/signup" component={Signup}></Route>
                    <Route path="/dashboard" component={Dashboard}></Route>
                </div>
            </Router>
    </FirebaseContext.Provider>
    , document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
