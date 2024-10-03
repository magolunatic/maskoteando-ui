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

    useEffect(() => {
        const token = localStorage.getItem('access_token');

        axios.get('http://localhost:8000/api/clientes/', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then(response => {
            setClientes(response.data);
            console.log('response.data', response.data);
        })
        .catch(error => console.error(error));
    }, []);

    const agregarCliente = () => {
        const token = localStorage.getItem('access_token');

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
            console.error("Error al agregar el cliente:", error.response.data);
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
                <h1 className="text-center">Bienvenido al módulo de Clientes</h1>
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
                                    onChange={(e) => setNombre(e.target.value)} 
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="ci" className="form-label">CI</label>
                                <input 
                                    type="number" 
                                    className="form-control" 
                                    id="ci" 
                                    value={ci}
                                    onChange={(e) => setCi(e.target.value)} 
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="fechaNacimiento" className="form-label">Fecha de Nacimiento</label>
                                <input 
                                    type="date" 
                                    className="form-control" 
                                    id="fechaNacimiento" 
                                    value={fechaNacimiento}
                                    onChange={(e) => setFechaNacimiento(e.target.value)} 
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="direccion" className="form-label">Dirección</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    id="direccion" 
                                    value={direccion}
                                    onChange={(e) => setDireccion(e.target.value)} 
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="barrio" className="form-label">Barrio</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    id="barrio" 
                                    value={barrio}
                                    onChange={(e) => setBarrio(e.target.value)} 
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="ciudad" className="form-label">Ciudad</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    id="ciudad" 
                                    value={ciudad}
                                    onChange={(e) => setCiudad(e.target.value)} 
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="observacion" className="form-label">Observación</label>
                                <textarea 
                                    className="form-control" 
                                    id="observacion" 
                                    rows="3"
                                    value={observacion}
                                    onChange={(e) => setObservacion(e.target.value)} 
                                ></textarea>
                            </div>
                            <button 
                                type="button" 
                                className="btn btn-success w-100" 
                                onClick={agregarCliente}>
                                Agregar
                            </button>
                        </form>
                    </div>
                </div>

                <h3 className="text-center">Listado de Clientes</h3>
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th scope="col">Nombre</th>
                            <th scope="col">CI</th>
                            <th scope="col">Fecha de Nacimiento</th>
                            <th scope="col">Dirección</th>
                            <th scope="col">Barrio</th>
                            <th scope="col">Ciudad</th>
                            <th scope="col">Observación</th>
                            <th scope="col">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clientes.map((cliente) => (
                            <tr key={cliente.id}>
                                <td>{cliente.nombre}</td>
                                <td>{cliente.ci}</td>
                                <td>{cliente.fecha_nacimiento}</td>
                                <td>{cliente.direccion}</td>
                                <td>{cliente.barrio}</td>
                                <td>{cliente.ciudad}</td>
                                <td>{cliente.observacion}</td>
                                <td>
                                    <button 
                                        className="btn btn-danger btn-sm" 
                                        onClick={() => eliminarCliente(cliente.id)}>
                                        X
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Clientes;
