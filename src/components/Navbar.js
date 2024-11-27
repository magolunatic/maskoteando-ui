import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css'; // Importar el archivo CSS

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
    <nav className="navbar navbar-expand-lg navbar-light custom-navbar">
      <div className="container-fluid">
        <div className="navbar-brand d-flex align-items-center">
          <img
            src="images/image.png" // Ruta de la imagen
            alt="Logo"
            style={{ width: '50px', height: '50px', marginRight: '8px' }}
          />
        </div>
        {/* Nombre estático sin redirección */}
        <span className="navbar-brand">VetSystem</span>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to="/home">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/productos">
                Productos
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/mascotas">
                Pacientes
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/clientes">
                Clientes
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/ventas">
                Ventas
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/veterinarios">
                Veterinarios
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/Agendamientos">
                Agendamientos
              </Link>
            </li>
          </ul>
        </div>
        {/* Botón Cerrar Sesión */}
        <button
          className="btn ms-auto logout-button"
          onClick={handleLogout}
        >
          Cerrar Sesión
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
