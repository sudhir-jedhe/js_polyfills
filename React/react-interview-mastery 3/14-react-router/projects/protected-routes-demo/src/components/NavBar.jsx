import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function NavBar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  return (
    <nav style={{ display: 'flex', gap: '1rem', padding: '1rem', borderBottom: '1px solid #ddd' }}>
      <Link to="/">Home</Link>
      <Link to="/dashboard">Dashboard</Link>
      {isAuthenticated ? (
        <>
          <span>Signed in as {user.email}</span>
          <button onClick={handleLogout}>Log out</button>
        </>
      ) : (
        <Link to="/login">Log in</Link>
      )}
    </nav>
  );
}
