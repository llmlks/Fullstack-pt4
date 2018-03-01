import deepFreeze from 'deep-freeze'
import feedbackReducer from './reducer'

describe('unicafe reducer', () => {
    const initialState = {
        good: 0,
        ok: 0,
        bad: 0,
        total: 0
    }

    const actionChangesStateTo = (initState, action, expectedState) => {
        if (initState !== undefined) {
            deepFreeze(initState)
        }

        const newState = feedbackReducer(initState, action)
        expect(newState).toEqual(expectedState)
    }

    it('should return a proper initial state when called with undefined state', () => {
        const action = {
            type: 'DO_NOTHING'
        }

        actionChangesStateTo(undefined, action, initialState)
    })

    it('good is incremented', () => {
        const action = {
            type: 'GOOD'
        }
        const newState = {
            good: 1,
            ok: 0,
            bad: 0,
            total: 1
        }

        actionChangesStateTo(initialState, action, newState)
    })

    it('ok is incremented', () => {
        const action = {
            type: 'OK'
        }
        const newState = {
            good: 0,
            ok: 1,
            bad: 0,
            total: 1
        }

        actionChangesStateTo(initialState, action, newState)
    })

    it('bad is incremented', () => {
        const action = {
            type: 'BAD'
        }
        const newState = {
            good: 0,
            ok: 0,
            bad: 1,
            total: 1
        }

        actionChangesStateTo(initialState, action, newState)
    })

    it('everything is set to zero', () => {
        const action = {
            type: 'ZERO'
        }
        const startState = {
            good: 3,
            ok: 1,
            bad: 2,
            total: 6
        }

        actionChangesStateTo(startState, action, initialState)
    })
})