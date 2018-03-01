import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { createStore } from 'redux'
import feedbackReducer from './reducer'

const store = createStore(feedbackReducer)

const renderApp = () => {
    ReactDOM.render(<App store={store} />, document.getElementById('root'))
}

renderApp()

store.subscribe(renderApp)