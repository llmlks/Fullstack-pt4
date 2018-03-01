
const defaultState = {
    total: 0,
    good: 0,
    ok: 0,
    bad: 0
}

const feedbackReducer = (state = defaultState, action) => {
    switch (action.type) {
        case 'GOOD':
            return { ...state, good: state.good + 1, total: state.total + 1 }
        case 'BAD':
            return { ...state, bad: state.bad + 1, total: state.total + 1 }
        case 'OK':
            return { ...state, ok: state.ok + 1, total: state.total + 1 }
        case 'ZERO':
            return defaultState
        default:
            return state
    }
}

export default feedbackReducer