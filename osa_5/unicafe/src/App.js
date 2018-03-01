import React, { Component } from 'react';
import Statistics from './components/Statistics'

class App extends Component {

	constructor(props) {
		super(props)
		this.state = {
			store: props.store
		}
	}

	click = (action) => {
		return () => this.state.store.dispatch({ type: action })
	}

	render() {
		return (
			<div>
				<h2>Give feedback</h2>
				<button onClick={this.click('GOOD')}>hyvä</button>
        		<button onClick={this.click('OK')}>neutraali</button>
        		<button onClick={this.click('BAD')}>huono</button>
				<Statistics store={this.state.store} click={this.click} />
			</div>
		)
  	}
}

export default App;
