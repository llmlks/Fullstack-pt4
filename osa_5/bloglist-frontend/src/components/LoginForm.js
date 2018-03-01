import React from 'react'
import PropTypes from 'prop-types'

const LoginForm = ({ username, password, fieldHandler, loginHandler }) => {
    return (
        <form onSubmit={loginHandler}>
            <h3>Log in</h3>

            <div>
                Username:
                <input 
                    type="text"
                    name="username"
                    value={username}
                    onChange={fieldHandler}
                />
            </div>
            <div>
                Password:
                <input
                    type="password"
                    name="password"
                    value={password}
                    onChange={fieldHandler}
                />
            </div>
            <button type="submit">Log in</button>
        </form>
    )
}

LoginForm.propTypes = {
    username: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
    fieldHandler: PropTypes.func.isRequired,
    loginHandler: PropTypes.func.isRequired
}

export default LoginForm