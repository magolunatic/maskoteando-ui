import React from 'react';
import { useNavigate } from 'react-router-dom';
//import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../index.css';  // Asegúrate de que esta ruta sea correcta



const Home = () => {
  const navigate = useNavigate();

  // Función de navegación para el botón de registro
  const irRegistro = () => {
    navigate('/register');
  };

  return (
    <div 
      style={{
        backgroundImage: `url('/images/perro.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '86vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        color: 'black',
        paddingTop: '20px',
      }}
      >
      <h1 className="text-center">Bienvenido a  VetSystem</h1>
      <div className="text-center mb-4">
        <img src="/images/maskoteando.png" alt="Logo" className="img-fluid" style={{ maxWidth: '350px' }} />
      </div>
      <div className="d-flex justify-content-center gap-3 my-3">
        {/* Aplica la clase personalizada aquí */}
        <button className="btn" onClick={irRegistro}  style={{
            backgroundColor: '#563A9C',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            fontSize: '16px',
            borderRadius: '5px',
          }}>
          Registrarse
        </button>
      </div>
    </div>
  );
};


export default Home;
