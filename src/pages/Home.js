import React from 'react';

import { useNavigate } from 'react-router-dom';

import { toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

const Home = () => {

  const navigate = useNavigate();

  const ir_modulo_productos = () => {
    navigate('/productos');
  };

  const ir_modulo_mascotas = () => {
    navigate('/mascotas');
  };

  const ir_modulo_clientes = () => {
    navigate('/clientes');
  };

  const notify = () => {
    toast.success('¡Has hecho clic en el botón!', {
      position: "top-right",  // Usa una cadena en lugar de una constante
      autoClose: 5000,  // La notificación se cierra automáticamente después de 3 segundos
    });
  }

  return (
    <div>
      <br></br>
      <br></br>
      <div className="container">
        
        <h1 className="text-center">Bienvenido al módulo Home</h1>

        <br></br>
        <br></br>

        <button className="btn btn-success" onClick={ir_modulo_productos}>
          Productos
        </button>
        <br></br>
        <br></br>

        <button className="btn btn-primary" onClick={ir_modulo_mascotas}>
          Mascotas
        </button>

        <br></br>
        <br></br>

        <button className="btn btn-info" onClick={ir_modulo_clientes}>
          Clientes
        </button>
        
        <br></br>
        <br></br>

        <button className="btn btn-warning" onClick={notify}>
          Notificación
        </button>

      </div>
    </div>
  );
};

export default Home;
