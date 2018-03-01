import React from 'react'

const Statistics = ({ store, click }) => {
    const { total, good, ok, bad } = store.getState()

    if (total === 0) {
        return (
            <div>
                <h2>Statistics</h2>
                <div>No feedback given</div>
            </div>
        )
    }

    const average = (good*1 + ok*0 + bad*(-1)) / total
    const positive = (good / total) * 100

    return (
        <div>
            <h2>Statistics</h2>
            <table>
                <tbody>
                    <tr>
                        <td>Good</td>
                        <td>{good}</td>
                    </tr>
                    <tr>
                        <td>Neutral</td>
                        <td>{ok}</td>
                    </tr>
                    <tr>
                        <td>Bad</td>
                        <td>{bad}</td>
                    </tr>
                    <tr>
                        <td>Average</td>
                        <td>{average.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td>Positive</td>
                        <td>{positive.toFixed(2)}%</td>
                    </tr>
                </tbody>
            </table>

            <button onClick={click('ZERO')}>Clear results</button>
        </div>
    )
}

export default Statistics