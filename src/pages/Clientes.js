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
    const [errores, setErrores] = useState({});
    const [clienteEditando, setClienteEditando] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        axios.get('http://localhost:8000/api/clientes/', {
            headers: { Authorization: `Bearer ${token}` },
        })
        .then(response => setClientes(response.data))
        .catch(error => console.error(error));
    }, []);

    const validarCampo = (campo, valor) => {
        const soloLetras = /^[a-zA-Z\s]*$/;
        const erroresTemp = { ...errores };

        if (campo === 'nombre' && !soloLetras.test(valor)) {
            erroresTemp.nombre = 'Solo se permiten letras y espacios';
        } else {
            erroresTemp.nombre = '';
        }

        if (campo === 'ci' && (isNaN(valor) || valor === '')) {
            erroresTemp.ci = 'El CI debe ser un número válido';
        } else {
            erroresTemp.ci = '';
        }

        setErrores(erroresTemp);
    };

    const agregarCliente = () => {
        if (Object.values(errores).some(error => error) || 
            !nombre || !ci || !fechaNacimiento || !direccion || !barrio || !ciudad) {
            alert('Por favor corrige los errores en el formulario antes de continuar.');
            return;
        }

        const token = localStorage.getItem('access_token');
        const nuevoCliente = {
            nombre,
            ci: parseInt(ci, 10),
            fecha_nacimiento: fechaNacimiento,
            direccion,
            barrio,
            ciudad,
        };

        if (clienteEditando) {
            // Si estamos editando, hacemos una solicitud PUT
            axios.put(`http://localhost:8000/api/clientes/${clienteEditando.id}/`, nuevoCliente, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then(response => {
                const clientesActualizados = clientes.map(cliente =>
                    cliente.id === clienteEditando.id ? response.data : cliente
                );
                setClientes(clientesActualizados);
            })
            .catch(error => console.error("Error al actualizar el cliente:", error.response?.data));
        } else {
            // Si estamos agregando un nuevo cliente, hacemos una solicitud POST
            axios.post('http://localhost:8000/api/clientes/', nuevoCliente, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then(response => setClientes([...clientes, response.data]))
            .catch(error => console.error("Error al agregar el cliente:", error.response?.data));
        }

        // Limpiar el formulario después de agregar o editar
        setNombre('');
        setCi('');
        setFechaNacimiento('');
        setDireccion('');
        setBarrio('');
        setCiudad('');
        setClienteEditando(null); // Limpiar el estado de edición
    };

    const eliminarCliente = (id) => {
        const token = localStorage.getItem('access_token');
        axios.delete(`http://localhost:8000/api/clientes/${id}/`, {
            headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => setClientes(clientes.filter(cliente => cliente.id !== id)))
        .catch(error => console.error(error));
    };

    const editarCliente = (cliente) => {
        setClienteEditando(cliente);
        setNombre(cliente.nombre);
        setCi(cliente.ci);
        setFechaNacimiento(cliente.fecha_nacimiento);
        setDireccion(cliente.direccion);
        setBarrio(cliente.barrio);
        setCiudad(cliente.ciudad);
    };

    return (
        <div className="container">
            <h1 className="text-center">Clientes</h1>
            <div 
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: `url('/images/perro2.png')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    zIndex: -1,
                }}
            ></div>
            <div className="text-center mb-4">
                <img src="/images/maskoteando.png" alt="Logo" className="img-fluid" style={{ maxWidth: '350px' }} />
            </div>
            <div className="row">
                {/* Columna para el formulario de agregar/editar cliente */}
                <div className="col-md-6" style={{ marginLeft: '-120px' }}>
                    <div className="card mx-auto " style={{ maxWidth: '500px' }}>
                        <div className="card-body">
                            <h5 className="card-title text-center">{clienteEditando ? 'Editar Cliente' : 'Registrar Cliente'}</h5>
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
                                <button 
                                    type="button" 
                                    className="btn w-100"  
                                    style={{
                                        backgroundColor: '#563A9C',
                                        color: 'white',
                                        border: 'none',
                                        padding: '10px 20px',
                                        fontSize: '16px',
                                        borderRadius: '5px',
                                        display: 'block',
                                        margin: '0 auto'
                                    }} 
                                    onClick={agregarCliente}>
                                    {clienteEditando ? 'Actualizar' : 'Agregar'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Columna para el listado de clientes */}
                <div className="col-md-6" >
                    <h3 className="text-center " >Listado de Clientes</h3>
                        <table className="table table-bordered table-striped">
                            <thead>
                                <tr>
                                    <th scope="col">Nombre</th>
                                    <th scope="col">CI</th>
                                    <th scope="col">Fecha Nac.</th>
                                    <th scope="col">Dirección</th>
                                    <th scope="col">Barrio</th>
                                    <th scope="col">Ciudad</th>
                                    <th scope="col">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {clientes.map(cliente => (
                                    <tr key={cliente.id}>
                                        <td>{cliente.nombre}</td>
                                        <td>{cliente.ci}</td>
                                        <td>{cliente.fecha_nacimiento}</td>
                                        <td>{cliente.direccion}</td>
                                        <td>{cliente.barrio}</td>
                                        <td>{cliente.ciudad}</td>
                                        <td>
                                            <button 
                                                className="btn btn-warning w-2" 
                                                onClick={() => editarCliente(cliente)}>
                                                Editar
                                            </button>
                                            <button 
                                                className="btn  btn-danger w-2"
                                                onClick={() => eliminarCliente(cliente.id)}>
                                                eliminar
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
