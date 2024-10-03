import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ setAccessToken }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Eliminar los tokens y estado de autenticación del localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('isAuthenticated');

    // Actualizar el estado de accessToken a null para que el Navbar desaparezca
    setAccessToken(null);

    // Redirigir al login
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/home">Maskoteando App</Link>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to="/home">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/productos">Productos</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/mascotas">Mascotas</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/clientes">Clientes</Link>
            </li>
          </ul>
        </div>
        {/* Botón Cerrar Sesión */}
        <button 
          className="btn btn-danger ms-auto"
          onClick={handleLogout}
        >
          Cerrar Sesión
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
