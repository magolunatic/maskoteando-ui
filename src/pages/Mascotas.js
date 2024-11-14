import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Mascotas = () => {
    const [mascotas, setMascotas] = useState([]);
    const [nombre, setNombre] = useState('');
    const [fechaNacimiento, setFechaNacimiento] = useState('');
    const [raza, setRaza] = useState('');
    const [color, setColor] = useState('');
    const [sexo, setSexo] = useState('');
    const [especie, setEspecie] = useState('');
    const [clienteId, setClienteId] = useState('');
    const [errores, setErrores] = useState({
        nombre: '',
        fechaNacimiento: '',
        raza: '',
        color: '',
        especie: '',
        sexo: '',
        cliente: ''
    });
    const [clientes, setClientes] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        axios.get('http://localhost:8000/api/mascotas/', {
            headers: { Authorization: `Bearer ${token}` },
        })
        .then(response => setMascotas(response.data))
        .catch(error => console.error(error));

        axios.get('http://localhost:8000/api/clientes/', {
            headers: { Authorization: `Bearer ${token}` },
        })
        .then(response => setClientes(response.data))
        .catch(error => console.error(error));
    }, []);

    const validarCampo = (campo, valor) => {
        const soloLetras = /^[a-zA-Z\s]*$/;
        if (['nombre', 'raza', 'color', 'especie'].includes(campo)) {
            setErrores(prev => ({ 
                ...prev, 
                [campo]: soloLetras.test(valor) ? '' : 'Solo se permiten letras y espacios' 
            }));
        }
    };

    const agregarMascota = () => {
        const token = localStorage.getItem('access_token');
        if (Object.values(errores).some(error => error) || 
            !nombre || !raza || !color || !especie || !fechaNacimiento || !sexo || !clienteId) {
            alert('Por favor corrige los errores en el formulario antes de continuar.');
            return;
        }

        const nuevaMascota = {
            nombre,
            fecha_nacimiento: fechaNacimiento,
            raza,
            color,
            sexo,
            especie,
            cliente: clienteId,
        };

        axios.post('http://localhost:8000/api/mascotas/', nuevaMascota, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        })
        .then(response => setMascotas([...mascotas, response.data]))
        .catch(error => console.error("Error al agregar la mascota:", error.response?.data));

        setNombre('');
        setFechaNacimiento('');
        setRaza('');
        setColor('');
        setEspecie('');
        setSexo('');
        setClienteId('');
    };

    const eliminarMascota = (id) => {
        const token = localStorage.getItem('access_token');
        axios.delete(`http://localhost:8000/api/mascotas/${id}/`, {
            headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => setMascotas(mascotas.filter(mascota => mascota.id !== id)))
        .catch(error => console.error(error));
    };

    return (
        <div>
            <div className="container">
                <h1 className="text-center">Mascotas</h1>
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
                    <img src="/images/LOGO MASKOTEANDO.png" alt="Logo" className="img-fluid" style={{ maxWidth: '350px' }} />
                </div>

                {/* Aquí se utiliza una fila para tener dos columnas */}
                <div className="row">
                    {/* Columna para el ABM de Mascotas */}
                    <div className="col-md-6 mb-4">
                        <div className="card mx-auto">
                            <div className="card-body">
                                <h5 className="card-title text-center">Pacientes</h5>
                                <form>
                                    {/* Campos del formulario para agregar mascotas */}
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
                                            onChange={(e) => {
                                                setRaza(e.target.value);
                                                validarCampo('raza', e.target.value);
                                            }} 
                                        />
                                        {errores.raza && <small className="text-danger">{errores.raza}</small>}
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="color" className="form-label">Color</label>
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            id="color" 
                                            value={color}
                                            onChange={(e) => {
                                                setColor(e.target.value);
                                                validarCampo('color', e.target.value);
                                            }} 
                                        />
                                        {errores.color && <small className="text-danger">{errores.color}</small>}
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="especie" className="form-label">Especie</label>
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            id="especie" 
                                            value={especie}
                                            onChange={(e) => {
                                                setEspecie(e.target.value);
                                                validarCampo('especie', e.target.value);
                                            }} 
                                        />
                                        {errores.especie && <small className="text-danger">{errores.especie}</small>}
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="sexo" className="form-label">Sexo</label>
                                            <select 
                                                id="sexo" 
                                                className="form-select" 
                                                value={sexo} 
                                                onChange={(e) => setSexo(e.target.value)}>
                                                <option value="">Selecciona un sexo</option>
                                                <option value="M">Macho</option>
                                                <option value="H">Hembra</option>
                                            </select>
                                    </div>
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
                    </div>

                    {/* Columna para el listado de Mascotas */}
                    <div className="col-md-6">
                        <h3 className="text-center">Listado de Mascotas</h3>
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th scope="col">Nombre</th>
                                    <th scope="col">Fecha de Nacimiento</th>
                                    <th scope="col">Raza</th>
                                    <th scope="col">Color</th>
                                    <th scope="col">Especie</th>
                                    <th scope="col">Sexo</th>
                                    <th scope="col">Cliente</th>
                                    <th scope="col">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {mascotas.map(mascota => (
                                    <tr key={mascota.id}>
                                        <td>{mascota.nombre}</td>
                                        <td>{mascota.fecha_nacimiento}</td>
                                        <td>{mascota.raza}</td>
                                        <td>{mascota.color}</td>
                                        <td>{mascota.especie}</td>
                                        <td>{mascota.sexo}</td>
                                        <td>{mascota.cliente}</td>
                                        <td>
                                            <button className="btn btn-danger" onClick={() => eliminarMascota(mascota.id)}>
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
        </div>
    );
};

export default Mascotas;
