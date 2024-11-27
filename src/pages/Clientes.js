import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Clientes = () => {
    const [clientes, setClientes] = useState([]);
    const [filtroClientes, setFiltroClientes] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [ci, setCi] = useState('');
    const [fechaNacimiento, setFechaNacimiento] = useState('');
    const [direccion, setDireccion] = useState('');
    const [barrio, setBarrio] = useState('');
    const [ciudad, setCiudad] = useState('');
    const [errores, setErrores] = useState({});
    const [clienteEditando, setClienteEditando] = useState(null);
    const [telefono, setTelefono] = useState('');
    const [email, setEmail] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        axios.get('http://localhost:8000/api/clientes/', {
            headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
            setClientes(response.data);
            setFiltroClientes(response.data);
        })
        .catch(error => console.error(error));
    }, []);

    useEffect(() => {
        const resultado = clientes.filter(
            (cliente) =>
                cliente.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                cliente.apellido.toLowerCase().includes(busqueda.toLowerCase()) ||
                cliente.ci.toString().includes(busqueda)
        );
        setFiltroClientes(resultado);
    }, [busqueda, clientes]);
        
    const validarCampo = (campo, valor) => {
        const soloLetras = /^[a-zA-Z\s]*$/;
        const erroresTemp = { ...errores };

        if (campo === 'nombre' && !soloLetras.test(valor)) {
            erroresTemp.nombre = 'Solo se permiten letras y espacios';
        } else {
            erroresTemp.nombre = '';
        }

        if (campo === 'apellido' && !soloLetras.test(valor)) {
            erroresTemp.apellido = 'Solo se permiten letras y espacios';
        } else {
            erroresTemp.apellido = '';
        }

        if (campo === 'ci' && (isNaN(valor) || valor === '')) {
            erroresTemp.ci = 'El CI debe ser un número válido';
        } else {
            erroresTemp.ci = '';
        }

        if (campo === 'telefono' && !/^\d{7,15}$/.test(valor)) {
            erroresTemp.telefono = 'El teléfono debe contener entre 7 y 15 dígitos';
        } else if (campo === 'email' && !/\S+@\S+\.\S+/.test(valor)) {
            erroresTemp.email = 'Formato de correo electrónico inválido';
        } else {
            erroresTemp[campo] = '';
        }

        setErrores(erroresTemp);
    };

    const agregarCliente = () => {
        if (Object.values(errores).some(error => error) || 
            !nombre || !apellido || !ci || !fechaNacimiento || !direccion || !barrio || !ciudad || !telefono || !email) {
            alert('Por favor corrige los errores en el formulario antes de continuar.');
            return;
        }

        const token = localStorage.getItem('access_token');
        const nuevoCliente = {
            nombre,
            apellido,
            ci: parseInt(ci, 10),
            fecha_nacimiento: fechaNacimiento,
            direccion,
            barrio,
            ciudad,
            telefono,
            email,
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
        setApellido(''); 
        setCi('');
        setFechaNacimiento('');
        setDireccion('');
        setBarrio('');
        setCiudad('');
        setClienteEditando(null); // Limpiar el estado de edición
        setTelefono('');
        setEmail('');
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
        setApellido(cliente.apellido);
        setCi(cliente.ci);
        setFechaNacimiento(cliente.fecha_nacimiento);
        setDireccion(cliente.direccion);
        setBarrio(cliente.barrio);
        setCiudad(cliente.ciudad);
        setTelefono(cliente.telefono);
        setEmail(cliente.email);
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
            <div className="d-flex justify-content-between align-items-center mb-3">
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
                                    <label htmlFor="apellido" className="form-label">Apellido</label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        id="apellido" 
                                        value={apellido}
                                        onChange={(e) => {setApellido(e.target.value);
                                        validarCampo('apellido', e.target.value); // Llama a validarCampo al cambiar
                                        }}
                                    />
                                    {errores.apellido && <small className="text-danger">{errores.apellido}</small>}
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
                                <div className="mb-3">
                                    <label htmlFor="telefono" className="form-label">Teléfono</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="telefono"
                                        value={telefono}
                                        onChange={(e) => {
                                            setTelefono(e.target.value);
                                            validarCampo('telefono', e.target.value);
                                        }}
                                    />
                                    {errores.telefono && <small className="text-danger">{errores.telefono}</small>}
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="email"
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                            validarCampo('email', e.target.value);
                                        }}
                                    />
                                    {errores.email && <small className="text-danger">{errores.email}</small>}
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
                    <div className="d-flex justify-content-between align-items-center mb-3"></div>
                    {/* Input de búsqueda */}
                        <div className="input-group" style={{ maxWidth: '300px', marginLeft: 'auto'  }}>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Buscar clientes"
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                        />
                        <button className="btn btn-danger">
                            <i className="bi bi-search"></i>
                        </button>
                    </div>
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th scope="col">Nombre</th>
                                    <th scope="col">Apellido</th>
                                    <th scope="col">CI</th>
                                    <th scope="col">Fecha Nac.</th>
                                    <th scope="col">Dirección</th>
                                    <th scope="col">Barrio</th>
                                    <th scope="col">Ciudad</th>
                                    <th scope="col">Telefono</th>
                                    <th scope="col">Email</th>
                                    <th scope="col">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtroClientes.map((cliente) => (
                                    <tr key={cliente.id}>
                                        <td>{cliente.nombre}</td>
                                        <td>{cliente.apellido}</td>
                                        <td>{cliente.ci}</td>
                                        <td>{cliente.fecha_nacimiento}</td>
                                        <td>{cliente.direccion}</td>
                                        <td>{cliente.barrio}</td>
                                        <td>{cliente.ciudad}</td>
                                        <td>{cliente.telefono}</td>
                                        <td>{cliente.email}</td>
                                        <td>
                                            <button
                                                className="btn btn-warning btn-sm"
                                                onClick={() => editarCliente(cliente)}
                                                >Editar
                                            </button>
                                            <button
                                                className="btn btn-danger btn-sm ml-2"
                                                onClick={() => eliminarCliente(cliente.id)}
                                                >Eliminar
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