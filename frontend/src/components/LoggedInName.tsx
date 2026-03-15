function LoggedInName()
{
  const storedUser = localStorage.getItem('user_data');
  const parsedUser = storedUser ? JSON.parse(storedUser) : null;

  const name = parsedUser
    ? `${parsedUser.firstName} ${parsedUser.lastName}`
    : 'Unknown User';

  function doLogout(event: any): void
  {
    event.preventDefault();
    localStorage.removeItem('user_data');
    window.location.href = '/';
  }

  return (
    <div id="loggedInDiv">
      <span id="userName">Logged In As {name}</span><br />
      <button
        type="button"
        id="logoutButton"
        className="buttons"
        onClick={doLogout}
      >
        Log Out
      </button>
    </div>
  );
}

export default LoggedInName;