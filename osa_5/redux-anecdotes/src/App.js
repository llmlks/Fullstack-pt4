import React from 'react'
import actionFor from './actions'

class App extends React.Component {

	vote = (anecdote) => () => {
		this.props.store.dispatch(
			actionFor.voting(anecdote)
		)
	}

	addAnecdote = (event) => {
		event.preventDefault()
		const content = event.target.anecdote.value

		this.props.store.dispatch(
			actionFor.adding(content)
		)
		event.target.anecdote.value = ''
	}

	render() {
		const anecdotes = this.props.store.getState()
		anecdotes.sort((a, b) => {
			return b.votes - a.votes
		})
		return (
			<div>
				<h2>Anecdotes</h2>
				{anecdotes.map(anecdote=>
					<div key={anecdote.id}>
						<div>
							{anecdote.content} 
						</div>
						<div>
							has {anecdote.votes}
							<button onClick={this.vote(anecdote)}>vote</button>
						</div>
					</div>
				)}
				<h2>create new</h2>
				<form onSubmit={this.addAnecdote}>
					<div><input name="anecdote" /></div>
					<button type="submit">create</button> 
				</form>
			</div>
		)
	}
}

export default App