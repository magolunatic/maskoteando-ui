import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Mascotas = () => {
    const [mascotas, setMascotas] = useState([]);
    const [nombre, setNombre] = useState('');
    const [fechaNacimiento, setFechaNacimiento] = useState('');
    const [raza, setRaza] = useState('');
    const [procedencia, setProcedencia] = useState('');

    const [clientes, setClientes] = useState([]);
    const [clienteId, setClienteId] = useState('');


    useEffect(() => {
        // Obtener el token de acceso desde el localStorage
        const token = localStorage.getItem('access_token');

        axios.get('http://localhost:8000/api/mascotas/', {
            headers: {
                Authorization: `Bearer ${token}`,  // Incluir el token en el encabezado
            },
        })
        .then(response => {
            setMascotas(response.data);
            console.log('response.data', response.data);
        })
        .catch(error => console.error(error));

        // Obtener lista de clientes
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

    const agregarMascota = () => {
        const token = localStorage.getItem('access_token'); // Obtener el token
    
        const nuevaMascota = {
            nombre,
            fecha_nacimiento: fechaNacimiento, // Asegúrate de que sea una cadena en formato aaaa-mm-dd
            raza,
            procedencia,
            cliente: clienteId,  // Asociar la mascota con el cliente seleccionado
        };
    
        axios.post('http://localhost:8000/api/mascotas/', nuevaMascota, {
            headers: {
                Authorization: `Bearer ${token}`,  // Incluir el token en el encabezado
            },
        })
        .then(response => setMascotas([...mascotas, response.data]))
        .catch(error => {
            console.error("Error al agregar la mascota:", error.response.data);
        });
    
        // Limpiar campos después de agregar
        setNombre('');
        setFechaNacimiento('');
        setRaza('');
        setProcedencia('');
        setClienteId('');  // Limpiar el campo cliente
    };

    const eliminarMascota = (id) => {
        const token = localStorage.getItem('access_token');  // Obtener el token

        axios.delete(`http://localhost:8000/api/mascotas/${id}/`, {
            headers: {
                Authorization: `Bearer ${token}`,  // Incluir el token en el encabezado
            },
        })
        .then(() => setMascotas(mascotas.filter(mascota => mascota.id !== id)))
        .catch(error => console.error(error));
    };

    return (
        <div>
            <div className="container">
                <h1 className="text-center">Bienvenido al módulo de Mascotas</h1>
                <div className="card mx-auto" style={{ maxWidth: '600px' }}>
                    <div className="card-body">
                        <h5 className="card-title text-center">ABM de Mascotas</h5>
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
                                <label htmlFor="raza" className="form-label">Raza</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    id="raza" 
                                    value={raza}
                                    onChange={(e) => setRaza(e.target.value)} 
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="procedencia" className="form-label">Procedencia</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    id="procedencia" 
                                    value={procedencia}
                                    onChange={(e) => setProcedencia(e.target.value)} 
                                />
                            </div>

                            {/* Lista desplegable de clientes */}
                            <div className="mb-3">
                            <label htmlFor="cliente" className="form-label">Cliente</label>
                            <select 
                                id="cliente" 
                                className="form-select" 
                                value={clienteId} 
                                onChange={(e) => setClienteId(e.target.value)}>
                                <option value="">Selecciona un cliente</option>
                                {clientes.map(cliente => (
                                    <option key={cliente.id} value={cliente.id}>
                                        {cliente.nombre} - CI: {cliente.ci}
                                    </option>
                                ))}
                            </select>

                        </div>

                            <button 
                                type="button" 
                                className="btn btn-success w-100" 
                                onClick={agregarMascota}>
                                Agregar
                            </button>
                        </form>
                    </div>
                </div>

                <h3 className="text-center">Listado de Mascotas</h3>
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th scope="col">Nombre</th>
                            <th scope="col">Fecha de Nacimiento</th>
                            <th scope="col">Raza</th>
                            <th scope="col">Procedencia</th>
                            <th scope="col">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mascotas.map((mascota) => (
                            <tr key={mascota.id}>
                                <td>{mascota.nombre}</td>
                                <td>{mascota.fecha_nacimiento}</td>
                                <td>{mascota.raza}</td>
                                <td>{mascota.procedencia}</td>
                                <td>
                                    <button 
                                        className="btn btn-danger btn-sm" 
                                        onClick={() => eliminarMascota(mascota.id)}>
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

export default Mascotas;
