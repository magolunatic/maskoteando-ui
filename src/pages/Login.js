import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function Login({ setAccessToken }) {  // Recibe setAccessToken como prop
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://localhost:8000/api/token/', {
        username,
        password,
      });

      // Verificar si se recibieron los tokens correctamente
      const { access, refresh } = response.data;

      if (access && refresh) {
        // Guardar los tokens en el localStorage
        localStorage.setItem('access_token', access);
        localStorage.setItem('refresh_token', refresh);
        localStorage.setItem('isAuthenticated', 'true');

        // Actualizar el estado de accessToken
        setAccessToken(access);

        // Redirigir a la página Home
        navigate('/home');
      } else {
        throw new Error('No se recibieron los tokens de autenticación');
      }
    } catch (error) {
      if (error.response && error.response.data) {
        // Si el servidor envía un mensaje de error específico, lo mostramos
        setError(error.response.data.detail || 'Error al iniciar sesión');
      } else {
        // Si hay un error de red u otro problema, mostramos un mensaje genérico
        setError('Credenciales inválidas, intenta de nuevo');
      }
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <form onSubmit={handleLogin} className="p-4 border rounded shadow" style={{ width: '300px' }}>
        <h3 className="mb-3 text-center">Iniciar Sesión</h3>
        {error && <div className="alert alert-danger" role="alert">{error}</div>}
        <div className="mb-3">
          <label htmlFor="username" className="form-label">Usuario</label>
          <input 
            type="text" 
            className="form-control" 
            id="username" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
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
            required 
          />
        </div>
        <button type="submit" className="btn btn-primary w-100 mb-2">Ingresar</button>
        <button type="button" className="btn btn-secondary w-100" onClick={() => navigate('/register')}>Registrarse</button>
      </form>
    </div>
  );
}

export default Login;
