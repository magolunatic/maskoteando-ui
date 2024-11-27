import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Veterinarios = () => {
    const [veterinarios, setVeterinarios] = useState([]);
    const [filtroVeterinarios, setFiltroVeterinarios] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [telefono, setTelefono] = useState('');
    const [especialidad, setEspecialidad] = useState('');
    const [horario, setHorario] = useState('');
    const [errores, setErrores] = useState({});
    const [veterinarioEditando, setVeterinarioEditando] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        console.log('Token almacenado:', token);
        axios.get('http://localhost:8000/api/veterinarios/', {
            headers: { Authorization: `Bearer ${token}` },
        })
        .then(response => {
            console.log('Datos recibidos:', response.data);
            setVeterinarios(response.data);
            setFiltroVeterinarios(response.data);
        })
        .catch(error => console.error(error));
    }, []);

    useEffect(() => {
        const resultado = veterinarios.filter(
            (veterinario) =>
                veterinario.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                veterinario.apellido.toLowerCase().includes(busqueda.toLowerCase()) ||
                veterinario.especialidad.toLowerCase().includes(busqueda.toLowerCase())
        );
        setFiltroVeterinarios(resultado);
    }, [busqueda, veterinarios]);

    const validarCampo = (campo, valor) => {
        const soloLetras = /^[a-zA-Z\s]*$/;
        const erroresActuales = { ...errores };

        if (['nombre', 'apellido', 'especialidad'].includes(campo)) {
            erroresActuales[campo] = soloLetras.test(valor) ? '' : 'Solo se permiten letras y espacios';
        }
        if (campo === 'telefono') {
            const soloNumeros = /^\d*$/;
            erroresActuales.telefono = soloNumeros.test(valor) ? '' : 'Solo se permiten números';
        }

        setErrores(erroresActuales);
    };

    const agregarVeterinario = () => {
        const token = localStorage.getItem('access_token');
    
        if (!nombre || !apellido || !telefono || !especialidad) {
            alert('Por favor completa todos los campos.');
            return;
        }
    
        const nuevoVeterinario = { nombre, apellido, telefono, especialidad, horario };
    
        if (veterinarioEditando) {
            // Si estamos editando, hacemos una solicitud PUT
            axios.put(`http://localhost:8000/api/veterinarios/${veterinarioEditando.id}/`, nuevoVeterinario, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then(response => {
                // Actualizar el veterinario modificado en la lista
                const veterinariosActualizados = veterinarios.map(vet =>
                    vet.id === veterinarioEditando.id ? response.data : vet
                );
                setVeterinarios(veterinariosActualizados);
                setFiltroVeterinarios(veterinariosActualizados); // Actualizar también el filtro
                setVeterinarioEditando(null); // Salir del modo edición
                limpiarFormulario(); // Limpiar el formulario
            })
            .catch(error => console.error('Error al editar el veterinario:', error));
        } else {
            // Si no estamos editando, hacemos un POST
            axios.post('http://localhost:8000/api/veterinarios/', nuevoVeterinario, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then(response => {
                setVeterinarios([...veterinarios, response.data]);
                setFiltroVeterinarios([...veterinarios, response.data]); // Actualizar también el filtro
                limpiarFormulario(); // Limpiar el formulario
            })
            .catch(error => console.error('Error al agregar el veterinario:', error));
        }
    };
    
    const eliminarVeterinario = (id) => {
        const token = localStorage.getItem('access_token');
        axios.delete(`http://localhost:8000/api/veterinarios/${id}/`, {
            headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => setVeterinarios(veterinarios.filter(vet => vet.id !== id)))
        .catch(error => console.error(error));
    };

    const editarVeterinario = (veterinario) => {
        setVeterinarioEditando(veterinario);
        setNombre(veterinario.nombre);
        setApellido(veterinario.apellido);
        setTelefono(veterinario.telefono);
        setEspecialidad(veterinario.especialidad);
        setHorario(veterinario.horario);
    };

    const limpiarFormulario = () => {
        setNombre('');
        setApellido('');
        setTelefono('');
        setEspecialidad('');
        setHorario('');
        setErrores({});
    };

    return (
        <div className="container">
            <h1 className="text-center">Veterinarios</h1>
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
            {/* Formulario de Registro */}
            <div className="row">
                <div className="col-md-6 mb-4">
                    <div className="card mx-auto">
                        <div className="card-body">
                            <h3>Registrar Veterinario</h3>
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
                                        onChange={(e) => {
                                            setApellido(e.target.value);
                                            validarCampo('apellido', e.target.value);
                                        }}
                                    />
                                    {errores.apellido && <small className="text-danger">{errores.apellido}</small>}
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
                                    <label htmlFor="especialidad" className="form-label">Especialidad</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="especialidad"
                                        value={especialidad}
                                        onChange={(e) => {
                                            setEspecialidad(e.target.value);
                                            validarCampo('especialidad', e.target.value);
                                        }}
                                    />
                                    {errores.especialidad && <small className="text-danger">{errores.especialidad}</small>}
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="horario" className="form-label">Horario</label>
                                    <textarea
                                        className="form-control"
                                        id="horario"
                                        value={horario}
                                        onChange={(e) => setHorario(e.target.value)}
                                    ></textarea>
                                </div>
                                <div className="text-center">
                                    <button type="button" className="btn w-100" style={{
                                        backgroundColor: '#563A9C',
                                        color: 'white',
                                        border: 'none',
                                        padding: '10px 20px',
                                        fontSize: '16px',
                                        borderRadius: '5px',
                                        display: 'block',
                                        margin: '0 auto'
                                    }} 
                                    onClick={agregarVeterinario}>
                                        {veterinarioEditando ? 'Actualizar Veterinario' : 'Agregar Veterinario'}
                                    </button>
                                </div>
                                
                            </form>
                        </div>
                    </div>
                </div>
                {/* Tabla de veterinarios */}
                <div className="col-md-6">
                    <h3 className="text-center">Listado de Veterinarios</h3>
                    <div className="d-flex align-items-center" style={{ marginLeft: 'auto', maxWidth: '300px' }}>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Buscar mascotas"
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                        />
                        <button className="btn btn-danger ms-2">
                            <i className="bi bi-search"></i>
                        </button>
                    </div>
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Apellido</th>
                                <th>Teléfono</th>
                                <th>Especialidad</th>
                                <th>Horario</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtroVeterinarios.map((vet) => (
                                <tr key={vet.id}>
                                    <td>{vet.nombre}</td>
                                    <td>{vet.apellido}</td>
                                    <td>{vet.telefono}</td>
                                    <td>{vet.especialidad}</td>
                                    <td>{vet.horario || 'No especificado'}</td>
                                    <td>
                                        <button 
                                            className="btn btn-warning btn-sm me-2" 
                                            onClick={() => editarVeterinario(vet)}
                                            >Editar
                                        </button>
                                        <button 
                                            className="btn btn-danger btn-sm" 
                                            onClick={() => eliminarVeterinario(vet.id)}
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

export default Veterinarios;
