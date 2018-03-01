const actionFor = {
	voting(anecdote) {
		return {
			type: 'VOTE',
			data: anecdote
		}
    },
    adding(content) {
        return {
            type: 'ADD_NEW',
            data: content
        }
    }
}

export default actionFor