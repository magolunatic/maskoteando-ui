import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8000/api/register/', {
        username,
        password,
      });

      // Guardar el token recibido en localStorage (si se devuelve uno)
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      localStorage.setItem('isAuthenticated', 'true');

      // Redirigir al home
      navigate('/home');
    } catch (error) {
      setError('Error al registrar el usuario, intenta de nuevo');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <form onSubmit={handleRegister} className="p-4 border rounded shadow" style={{ width: '300px' }}>
        <h3 className="mb-3 text-center">Registrarse</h3>
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
        <div className="mb-3">
          <label htmlFor="confirmPassword" className="form-label">Confirmar Contraseña</label>
          <input 
            type="password" 
            className="form-control" 
            id="confirmPassword" 
            value={confirmPassword} 
            onChange={(e) => setConfirmPassword(e.target.value)} 
            required 
          />
        </div>
        <button type="submit" className="btn btn-primary w-100 mb-2">Registrarse</button>
        <button type="button" className="btn btn-secondary w-100" onClick={() => navigate('/login')}>Volver</button>
      </form>
    </div>
  );
}

export default Register;
