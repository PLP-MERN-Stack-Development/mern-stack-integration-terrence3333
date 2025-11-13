import { Link } from 'react-router-dom';
import { authService } from '../services/api';

const Navbar = () => {
  const user = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    window.location.reload();
  };

  return (
    <nav className="flex justify-between items-center px-6 py-3 bg-gray-800 text-white">
      <Link to="/" className="text-xl font-bold">📝 MERN Blog</Link>
      <div className="flex gap-4">
        <Link to="/">Home</Link>
        {user ? (
          <>
            <Link to="/create">New Post</Link>
            <button onClick={handleLogout} className="bg-red-500 px-3 py-1 rounded">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
