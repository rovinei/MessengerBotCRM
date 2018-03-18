import React from 'react';
import ReactDOM from 'react-dom';
import createHistory from 'history/createBrowserHistory'
// import { ConnectedRouter } from 'react-router-redux'
import { Provider } from 'react-redux'
import configureStore from './store'
import {
    HashRouter,
    Route,
    Switch
} from 'react-router-dom';
import Login from './views/Login/Login.jsx';
import PrivateRoute from './containers/PrivateRoute.jsx';
import App from 'containers/App/App.jsx';
import jQuery from 'jquery';
import './assets/css/bootstrap.min.css';
import './assets/css/animate.min.css';
import './assets/sass/light-bootstrap-dashboard.css';
import './assets/css/demo.css';
import './assets/css/pe-icon-7-stroke.css';
import 'uikit/dist/css/uikit.min.css';
import './assets/sass/dashboard.css';

const history = createHistory()
const store = configureStore(history)

window.$ = window.jQuery = jQuery;
ReactDOM.render((
    <Provider store={store}>
        <HashRouter>
            <Switch>
                <Route exact path="/login/" component={Login} />
                <PrivateRoute path="/" component={App}/>
            </Switch>
        </HashRouter>
    </Provider>
),document.getElementById('root'));
