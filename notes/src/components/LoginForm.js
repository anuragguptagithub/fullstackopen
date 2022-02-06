import React from 'react'
import { useState } from 'react'

const LoginForm = ({ handleLogin }) => {

    const [username, setUsername] = useState('') 
    const [password, setPassword] = useState('') 
    const login = (event) => {
      event.preventDefault()
      handleLogin({username, password})
      setUsername('')
      setPassword('')
    }
  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={login}>
        <div>
          username
          <input
            id='username'
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            id='password'
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
      </div>
        <button id="login-button" type="submit">login</button>
      </form>
    </div>
  )
}

export default LoginForm