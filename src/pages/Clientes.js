import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Clientes = () => {
    const [clientes, setClientes] = useState([]);
    const [nombre, setNombre] = useState('');
    const [ci, setCi] = useState('');
    const [fechaNacimiento, setFechaNacimiento] = useState('');
    const [direccion, setDireccion] = useState('');
    const [barrio, setBarrio] = useState('');
    const [ciudad, setCiudad] = useState('');
    const [observacion, setObservacion] = useState('');

    // Estados para manejar errores
    const [errores, setErrores] = useState({
        nombre: '',
        ci: '',
        fechaNacimiento: '',
        direccion: '',
        barrio: '',
        ciudad: ''
    });

    useEffect(() => {
        const token = localStorage.getItem('access_token');

        axios.get('http://localhost:8000/api/clientes/', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then(response => {
            setClientes(response.data);
        })
        .catch(error => console.error(error));
    }, []);

    // Función para validar los campos
    const validarCampo = (campo, valor) => {
        switch (campo) {
            case 'nombre':
                if (!/^[a-zA-Z\s]*$/.test(valor)) {
                    setErrores(prev => ({ ...prev, nombre: 'Solo se permiten letras y espacios' }));
                } else {
                    setErrores(prev => ({ ...prev, nombre: '' }));
                }
                break;
            case 'ci':
                if (!/^\d+$/.test(valor)) {
                    setErrores(prev => ({ ...prev, ci: 'Solo se permiten números' }));
                } else {
                    setErrores(prev => ({ ...prev, ci: '' }));
                }
                break;
            case 'direccion':
                if (!/^[a-zA-Z0-9\s]*$/.test(valor)) {
                    setErrores(prev => ({ ...prev, direccion: 'Solo se permiten letras, números y espacios' }));
                } else {
                    setErrores(prev => ({ ...prev, direccion: '' }));
                }
                break;
            case 'barrio':
                if (!/^[a-zA-Z\s]*$/.test(valor)) {
                    setErrores(prev => ({ ...prev, barrio: 'Solo se permiten letras y espacios' }));
                } else {
                    setErrores(prev => ({ ...prev, barrio: '' }));
                }
                break;
            case 'ciudad':
                if (!/^[a-zA-Z\s]*$/.test(valor)) {
                    setErrores(prev => ({ ...prev, ciudad: 'Solo se permiten letras y espacios' }));
                } else {
                    setErrores(prev => ({ ...prev, ciudad: '' }));
                }
                break;
            case 'fechaNacimiento':
                if (!valor) {
                    setErrores(prev => ({ ...prev, fechaNacimiento: 'La fecha de nacimiento es obligatoria' }));
                } else {
                    setErrores(prev => ({ ...prev, fechaNacimiento: '' }));
                }
                break;
            default:
                break;
        }
    };

    const agregarCliente = () => {
        const token = localStorage.getItem('access_token');

        // Validar todos los campos antes de enviar
        if (errores.nombre || !nombre || errores.ci || !ci || errores.direccion || errores.barrio || errores.ciudad || !fechaNacimiento) {
            alert('Por favor corrige los errores en el formulario antes de continuar.');
            return;
        }

        const nuevoCliente = {
            nombre,
            ci: parseInt(ci, 10),  // Asegúrate de que 'ci' sea un número
            fecha_nacimiento: fechaNacimiento,
            direccion,
            barrio,
            ciudad,
            observacion,
        };

        axios.post('http://localhost:8000/api/clientes/', nuevoCliente, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then(response => setClientes([...clientes, response.data]))
        .catch(error => {
            console.error("Error al agregar el cliente:", error.response?.data);
        });

        // Limpiar campos después de agregar
        setNombre('');
        setCi('');
        setFechaNacimiento('');
        setDireccion('');
        setBarrio('');
        setCiudad('');
        setObservacion('');
    };

    const eliminarCliente = (id) => {
        const token = localStorage.getItem('access_token');

        axios.delete(`http://localhost:8000/api/clientes/${id}/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then(() => setClientes(clientes.filter(cliente => cliente.id !== id)))
        .catch(error => console.error(error));
    };

    return (
        <div>
            <div className="container">
                <h1 className="text-center">Clientes</h1>
                <div className="card mx-auto" style={{ maxWidth: '600px' }}>
                    <div className="card-body">
                        <h5 className="card-title text-center">ABM de Clientes</h5>
                        <form>
                            <div className="mb-3">
                                <label htmlFor="nombre" className="form-label">Nombre</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    id="nombre" 
                                    value={nombre}
                                    onChange={(e) => {
                                        setNombre(e.target.value);
                                        validarCampo('nombre', e.target.value);
                                    }} 
                                />
                                {errores.nombre && <small className="text-danger">{errores.nombre}</small>}
                            </div>
                            <div className="mb-3">
                                <label htmlFor="ci" className="form-label">CI</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    id="ci" 
                                    value={ci}
                                    onChange={(e) => {
                                        setCi(e.target.value);
                                        validarCampo('ci', e.target.value);
                                    }} 
                                />
                                {errores.ci && <small className="text-danger">{errores.ci}</small>}
                            </div>
                            <div className="mb-3">
                                <label htmlFor="fechaNacimiento" className="form-label">Fecha de Nacimiento</label>
                                <input 
                                    type="date" 
                                    className="form-control" 
                                    id="fechaNacimiento" 
                                    value={fechaNacimiento}
                                    onChange={(e) => {
                                        setFechaNacimiento(e.target.value);
                                        validarCampo('fechaNacimiento', e.target.value);
                                    }} 
                                />
                                {errores.fechaNacimiento && <small className="text-danger">{errores.fechaNacimiento}</small>}
                            </div>
                            <div className="mb-3">
                                <label htmlFor="direccion" className="form-label">Dirección</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    id="direccion" 
                                    value={direccion}
                                    onChange={(e) => {
                                        setDireccion(e.target.value);
                                        validarCampo('direccion', e.target.value);
                                    }} 
                                />
                                {errores.direccion && <small className="text-danger">{errores.direccion}</small>}
                            </div>
                            <div className="mb-3">
                                <label htmlFor="barrio" className="form-label">Barrio</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    id="barrio" 
                                    value={barrio}
                                    onChange={(e) => {
                                        setBarrio(e.target.value);
                                        validarCampo('barrio', e.target.value);
                                    }} 
                                />
                                {errores.barrio && <small className="text-danger">{errores.barrio}</small>}
                            </div>
                            <div className="mb-3">
                                <label htmlFor="ciudad" className="form-label">Ciudad</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    id="ciudad" 
                                    value={ciudad}
                                    onChange={(e) => {
                                        setCiudad(e.target.value);
                                        validarCampo('ciudad', e.target.value);
                                    }} 
                                />
                                {errores.ciudad && <small className="text-danger">{errores.ciudad}</small>}
                            </div>
                            <div className="mb-3">
                                <label htmlFor="observacion" className="form-label">Observación</label>
                                <textarea 
                                    className="form-control" 
                                    id="observacion" 
                                    rows="3"
                                    value={observacion}
                                    onChange={(e) => setObservacion(e.target.value)}
                                />
                            </div>
                            <button 
                                type="button" 
                                className="btn btn-primary" 
                                onClick={agregarCliente} 
                                disabled={errores.nombre || errores.ci || errores.direccion || errores.barrio || errores.ciudad || !nombre || !ci || !fechaNacimiento}>
                                Agregar Cliente
                            </button>
                        </form>
                    </div>
                </div>

                <div className="mt-5">
                    <h3>Clientes Registrados</h3>
                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col">Nombre</th>
                                <th scope="col">CI</th>
                                <th scope="col">Fecha de Nacimiento</th>
                                <th scope="col">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {clientes.map(cliente => (
                                <tr key={cliente.id}>
                                    <td>{cliente.nombre}</td>
                                    <td>{cliente.ci}</td>
                                    <td>{cliente.fecha_nacimiento}</td>
                                    <td>
                                        <button 
                                            className="btn btn-danger" 
                                            onClick={() => eliminarCliente(cliente.id)}
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Clientes;
