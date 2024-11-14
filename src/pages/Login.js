import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function Login({ setAccessToken }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isUserFocused, setIsUserFocused] = useState(false);  // Estado para el campo usuario
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);  // Estado para el campo contraseña
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://localhost:8000/api/token/', {
        username,
        password,
      });

      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      localStorage.setItem('isAuthenticated', 'true');

      setAccessToken(response.data.access);
      navigate('/home');
    } catch (error) {
      setError('Credenciales inválidas, intenta de nuevo');
    }
  };

  return (
    <div 
      style={{
        backgroundImage: `url('/images/perro2.png')`, // Ruta de la imagen de fondo
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <form onSubmit={handleLogin} className="p-4 border rounded shadow" style={{ backgroundColor: 'white' }}>
        
        <div className="navbar-brand d-flex align-items-center">
        <h3 className="mb-3 text-center">VetSystem</h3>
        {error && <div className="alert alert-danger" role="alert">{error}</div>}
          <img
            src="images/image.png"  // Ruta de la imagen
            alt="Logo"
            style={{ width: '80px', height: '80px', marginRight: '8px' }}
          />
        </div>

        <div className="text-center mb-3">
          <img 
            src={isPasswordFocused ? '/images/logo2.png' : isUserFocused ? '/images/LOGO3.png' : '/images/logo6.png'} 
            alt="Gatito" 
            style={{ width: '100px', height: 'auto' }} 
          />
        </div>

        <div className="mb-3">
          <label htmlFor="username" className="form-label">Usuario</label>
          <input 
            type="text" 
            className="form-control" 
            id="username" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            onFocus={() => setIsUserFocused(true)}  // Cuando el usuario enfoca el campo
            onBlur={() => setIsUserFocused(false)}  // Cuando el usuario deja el campo
            required 
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Contraseña</label>
          <input 
            type="password" 
            className="form-control" 
            id="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)} 
            onFocus={() => setIsPasswordFocused(true)}  // Cuando la contraseña enfoca el campo
            onBlur={() => setIsPasswordFocused(false)}  // Cuando la contraseña deja el campo
            required 
          />
        </div>
        <button type="submit" className="btn  mb-2"style={{
          backgroundColor: '#563A9C',
          color: 'white',
          border: 'none',
          padding: '10px 20px',
          fontSize: '16px',
          borderRadius: '5px',
          display: 'block', // Para centrar con margin auto
          margin: '0 auto'
          }}>Ingresar</button>
      </form>
    </div>
  );
}

export default Login;
