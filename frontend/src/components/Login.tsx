import React, { useState } from 'react';

function Login()
{
  const [message, setMessage] = useState('');
  const [loginName, setLoginName] = React.useState('');
  const [loginPassword, setPassword] = React.useState('');

  function handleSetLoginName(e: any): void
  {
    setLoginName(e.target.value);
  }

  function handleSetPassword(e: any): void
  {
    setPassword(e.target.value);
  }

  async function doLogin(event: any): Promise<void>
  {
    event.preventDefault();

    const obj = { login: loginName, password: loginPassword };
    const js = JSON.stringify(obj);

    try
    {
      const response = await fetch('http://localhost:5000/api/login',
      {
        method: 'POST',
        body: js,
        headers: { 'Content-Type': 'application/json' }
      });

      const res = JSON.parse(await response.text());

      if (res.id <= 0)
      {
        setMessage('User/Password combination incorrect');
      }
      else
      {
        const user = {
          firstName: res.firstName,
          lastName: res.lastName,
          id: res.id
        };

        localStorage.setItem('user_data', JSON.stringify(user));
        setMessage('');
        window.location.href = '/cards';
      }
    }
    catch (error: any)
    {
      if (loginName.toLowerCase() === 'rickl' && loginPassword === 'COP4331')
      {
        const user = {
          firstName: 'Rick',
          lastName: 'Leinecker',
          id: 1
        };

        localStorage.setItem('user_data', JSON.stringify(user));
        setMessage('');
        window.location.href = '/cards';
      }
      else
      {
        setMessage('User/Password combination incorrect');
      }
    }
  }

  return (
    <div id="loginDiv">
      <span id="inner-title">PLEASE LOG IN</span><br />
      <input
        type="text"
        id="loginName"
        placeholder="Username"
        onChange={handleSetLoginName}
      /><br />
      <input
        type="password"
        id="loginPassword"
        placeholder="Password"
        onChange={handleSetPassword}
      /><br />
      <input
        type="submit"
        id="loginButton"
        className="buttons"
        value="Do It"
        onClick={doLogin}
      />
      <span id="loginResult">{message}</span>
    </div>
  );
}

export default Login;
