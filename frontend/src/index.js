import React from 'react';
import ReactDOM from 'react-dom';
import createHistory from 'history/createBrowserHistory'
import { ConnectedRouter } from 'react-router-redux'
import { Provider } from 'react-redux'
import configureStore from './store'
import {
    HashRouter,
    Route,
    Switch
} from 'react-router-dom';
import App from 'containers/App/App.jsx';
import './assets/css/bootstrap.min.css';
import './assets/css/animate.min.css';
import './assets/sass/light-bootstrap-dashboard.css';
import './assets/css/demo.css';
import './assets/css/pe-icon-7-stroke.css';

const history = createHistory()
const store = configureStore(history)


ReactDOM.render((
    <Provider store={store}>
        <HashRouter history={history}>
            <Switch>
                <Route path="/" name="Home" component={App}/>
            </Switch>
        </HashRouter>
    </Provider>
),document.getElementById('root'));
