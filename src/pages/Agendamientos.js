import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';

const Agendamientos = () => {
    const [pacientes, setPacientes] = useState([]);
    const [veterinarios, setVeterinarios] = useState([]);
    const [agendamientos, setAgendamientos] = useState([]);
    const [mostrarAgregarCita, setMostrarAgregarCita] = useState(true); 
    const [fecha, setFecha] = useState('');
    const [hora, setHora] = useState('');
    const [pacienteId, setPacienteId] = useState('');
    const [veterinarioId, setVeterinarioId] = useState('');
    const [tipo, setTipo] = useState('');
    const [motivo, setMotivo] = useState('');
    const [notas, setNotas] = useState('');
    const [importancia, setImportancia] = useState('');



    const exportToExcel = () => {
        // Agrupar agendamientos por estado
        const confirmados = agendamientos.filter((ag) => ag.estado === 'confirmado');
        const pendientes = agendamientos.filter((ag) => ag.estado === 'pendiente');
        const cancelados = agendamientos.filter((ag) => ag.estado === 'cancelado');
    
        // Crear datos para el Excel
        const groupedData = [
            { Estado: 'Confirmados' },
            { Fecha: 'Fecha', Hora: 'Hora', Paciente: 'Paciente', Veterinario: 'Veterinario', Tipo: 'Tipo', Motivo: 'Motivo', Notas: 'Notas', Importancia: 'Importancia', Estado: 'Estado' },
            ...confirmados.map((ag) => ({
                Fecha: ag.fecha,
                Hora: ag.hora,
                Paciente: `${ag.paciente_nombre} (Dueño: ${ag.cliente_nombre} ${ag.cliente_apellido})`,
                Veterinario: `${ag.veterinario_nombre} - ${ag.veterinario_especialidad}`,
                Tipo: ag.tipo,
                Motivo: ag.motivo,
                Notas: ag.notas,
                Importancia: ag.importancia,
                Estado: ag.estado,
            })),
            { Estado: 'Pendientes' },
            { Fecha: 'Fecha', Hora: 'Hora', Paciente: 'Paciente', Veterinario: 'Veterinario', Tipo: 'Tipo', Motivo: 'Motivo', Notas: 'Notas', Importancia: 'Importancia', Estado: 'Estado' },
            ...pendientes.map((ag) => ({
                Fecha: ag.fecha,
                Hora: ag.hora,
                Paciente: `${ag.paciente_nombre} (Dueño: ${ag.cliente_nombre} ${ag.cliente_apellido})`,
                Veterinario: `${ag.veterinario_nombre} - ${ag.veterinario_especialidad}`,
                Tipo: ag.tipo,
                Motivo: ag.motivo,
                Notas: ag.notas,
                Importancia: ag.importancia,
                Estado: ag.estado,
            })),
            { Estado: 'Cancelados' },
            { Fecha: 'Fecha', Hora: 'Hora', Paciente: 'Paciente', Veterinario: 'Veterinario', Tipo: 'Tipo', Motivo: 'Motivo', Notas: 'Notas', Importancia: 'Importancia', Estado: 'Estado' },
            ...cancelados.map((ag) => ({
                Fecha: ag.fecha,
                Hora: ag.hora,
                Paciente: `${ag.paciente_nombre} (Dueño: ${ag.cliente_nombre} ${ag.cliente_apellido})`,
                Veterinario: `${ag.veterinario_nombre} - ${ag.veterinario_especialidad}`,
                Tipo: ag.tipo,
                Motivo: ag.motivo,
                Notas: ag.notas,
                Importancia: ag.importancia,
                Estado: ag.estado,
            })),
        ];
    
        // Crear el libro de Excel
        const ws = XLSX.utils.json_to_sheet(groupedData, { skipHeader: true });
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Agendamientos');
    
        // Descargar el archivo
        XLSX.writeFile(wb, 'Agendamientos.xlsx');
    };

    const actualizarEstado = (id, estado, metodo = null) => {
        const token = localStorage.getItem('access_token');
        const data = { estado };
        if (metodo) {
            data.metodo_confirmacion = metodo;
        }
    
        axios
            .post(`http://localhost:8000/api/agendamientos/${id}/actualizar_estado/`, data, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
                setAgendamientos((prevAgendamientos) =>
                    prevAgendamientos.map((ag) =>
                        ag.id === id
                            ? {
                                  ...ag,
                                  estado,
                                  metodo_confirmacion: metodo || ag.metodo_confirmacion,
                                  fecha_confirmacion: estado === 'confirmado' ? new Date().toISOString() : ag.fecha_confirmacion,
                              }
                            : ag
                    )
                );
            })
            .catch((error) => {
                console.error('Error en la actualización:', error.response?.data || error.message);
                alert('Error al actualizar el estado. Verifica los datos.');
            });
    };

    
    // useEffect para cargar pacientes, veterinarios y agendamientos
    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (!token) {
            console.error('No se encontró un token de autenticación.');
            return;
        }

        const fetchData = async () => {
            try {
                const [pacientesRes, veterinariosRes, agendamientosRes] = await Promise.all([
                    axios.get('http://localhost:8000/api/mascotas/', { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get('http://localhost:8000/api/veterinarios/', { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get('http://localhost:8000/api/agendamientos/', { headers: { Authorization: `Bearer ${token}` } }),
                ]);

                setPacientes(pacientesRes.data);
                setVeterinarios(veterinariosRes.data);
                setAgendamientos(agendamientosRes.data);
            } catch (error) {
                console.error('Error al cargar datos:', error.response?.data || error.message);
            }
        };

        fetchData();
    }, []);

    const agregarCita = () => {
        const token = localStorage.getItem('access_token');
        if (!fecha || !hora || !pacienteId || !veterinarioId || !tipo || (tipo === 'consulta' && !motivo)) {
            alert('Por favor completa todos los campos obligatorios.');
            return;
        }

        const nuevaCita = {
            fecha,
            hora,
            paciente: pacienteId,
            veterinario: veterinarioId,
            tipo,
            motivo,
            notas,
            importancia,
        };

        axios.post('http://localhost:8000/api/agendamientos/', nuevaCita, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        })
            .then(response => setAgendamientos([...agendamientos, response.data]))
            .catch(error => console.error("Error al agendar cita:", error.response?.data));

        // Limpiar formulario
        setFecha('');
        setHora('');
        setPacienteId('');
        setVeterinarioId('');
        setTipo('');
        setMotivo('');
        setNotas('');
        setImportancia('');
    };

    return (
        <div className="container">
            <h1 className="text-center">Agendamientos</h1>
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
            <div className="d-flex justify-content-between align-items-center mb-3"></div>


            {/* Listado de Agendamientos */}
            <div >
                    <h3 className="text-center">Listado de Agendamientos</h3>
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>Fecha</th>
                                <th>Hora</th>
                                <th>Paciente-Cliente</th>
                                <th>Veterinario</th>
                                <th>Tipo</th>
                                <th>Motivo</th>
                                <th>Notas</th>
                                <th>Importancia</th>
                                <th>Estado</th> {/* Nueva columna para el estado */}
                            </tr>
                        </thead>
                        <tbody>
                            {agendamientos.map(agendamiento => (
                                <tr key={agendamiento.id}>
                                    <td>{agendamiento.fecha}</td>
                                    <td>{agendamiento.hora}</td>
                                    <td>
                                        {agendamiento.paciente_nombre} 
                                        <br />
                                        (Dueño: {agendamiento.cliente_nombre} {agendamiento.cliente_apellido})
                                    </td>
                                    <td>
                                        {agendamiento.veterinario_nombre} - {agendamiento.veterinario_especialidad}
                                    </td>
                                    <td>{agendamiento.tipo}</td>
                                    <td>{agendamiento.motivo}</td>
                                    <td>{agendamiento.notas}</td>
                                    <td>{agendamiento.importancia}</td>
                                    <td>
                                        {/* Mostrar estado */}
                                        <span
                                            className={`badge ${
                                                agendamiento.estado === 'confirmado'
                                                    ? 'bg-success'
                                                    : agendamiento.estado === 'cancelado'
                                                    ? 'bg-danger'
                                                    : 'bg-warning'
                                            }`}
                                        >
                                            {agendamiento.estado.charAt(0).toUpperCase() + agendamiento.estado.slice(1)}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            <div className="container">
                {/* Botones de navegación */}
                <div className="mb-8">
                    <button
                        className="btn btn-warning"
                        onClick={() => setMostrarAgregarCita(true)}
                    >
                        Agregar Cita
                    </button>
                    <button
                        className="btn btn-danger w-2"
                        onClick={() => setMostrarAgregarCita(false)}
                    >
                        Estado de Citas
                    </button>

                    <button
                        className="btn btn-success"
                        onClick={exportToExcel}
                    >
                        Exportar a Excel
                    </button>
                </div>
                
                {mostrarAgregarCita ? (
                    // Formulario para agregar cita
                    <div className="row">
                        <div className="col-md-6 mb-4">
                            <div className="card mx-auto">
                                <div className="card-body">
                                    <h5 className="card-title text-center">Agendar Cita</h5>
                                    <form>
                                        <div className="mb-3">
                                            <label className="form-label">Fecha</label>
                                            <input type="date" className="form-control" value={fecha} onChange={(e) => setFecha(e.target.value)} />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Hora</label>
                                            <input type="time" className="form-control" value={hora} onChange={(e) => setHora(e.target.value)} />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Paciente</label>
                                            <select className="form-select" value={pacienteId} onChange={(e) => setPacienteId(e.target.value)}>
                                                <option value="">Seleccionar...</option>
                                                {pacientes.map(paciente => (
                                                    <option key={paciente.id} value={paciente.id}>
                                                        {paciente.nombre} (Dueño: {paciente.cliente_nombre} {paciente.cliente_apellido})
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Veterinario</label>
                                            <select className="form-select" value={veterinarioId} onChange={(e) => setVeterinarioId(e.target.value)}>
                                                <option value="">Seleccionar...</option>
                                                {veterinarios.map(veterinario => (
                                                    <option key={veterinario.id} value={veterinario.id}>
                                                        {veterinario.nombre} - {veterinario.especialidad}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Tipo de Agendamiento</label>
                                            <select className="form-select" value={tipo} onChange={(e) => setTipo(e.target.value)}>
                                                <option value="">Seleccionar...</option>
                                                <option value="peluqueria">Peluquería</option>
                                                <option value="vacunaciones">Vacunaciones</option>
                                                <option value="consulta">Consulta</option>
                                            </select>
                                        </div>
                                        {tipo === 'peluqueria' && (
                                            <div className="mb-3">
                                                <label className="form-label">Motivo</label>
                                                <select className="form-select" value={motivo} onChange={(e) => setMotivo(e.target.value)}>
                                                    <option value="">Seleccionar...</option>
                                                    <option value="corte_pelo">Corte de Pelo</option>
                                                    <option value="corte_unas">Corte de Uñas</option>
                                                    <option value="bano_normal">Baño Normal</option>
                                                    <option value="bano_medicado">Baño Medicado</option>
                                                </select>
                                            </div>
                                        )}
                                        {tipo === 'consulta' && (
                                            <div className="mb-3">
                                                <label className="form-label">Motivo</label>
                                                <select className="form-select" value={motivo} onChange={(e) => setMotivo(e.target.value)}>
                                                    <option value="">Seleccionar...</option>
                                                    <option value="control">Control</option>
                                                    <option value="post_operatorio">Post-operatorio</option>
                                                    <option value="post_parto">Post-parto</option>
                                                    <option value="internacion">Internación</option>
                                                    <option value="urgencias">Urgencias</option>
                                                    <option value="cirugias">Cirugías</option>
                                                </select>
                                            </div>
                                        )}
                                        {tipo === 'vacunaciones' && (
                                            <div className="mb-3">
                                                <label className="form-label">Motivo</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Describe el tipo de vacunación"
                                                    value={motivo}
                                                    onChange={(e) => setMotivo(e.target.value)}
                                                />
                                            </div>
                                        )}
                                        <div className="mb-3">
                                            <label className="form-label">Notas Internas</label>
                                            <textarea
                                                className="form-control"
                                                placeholder="Ej: Venir en ayuno"
                                                value={notas}
                                                onChange={(e) => setNotas(e.target.value)}
                                            ></textarea>
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Importancia</label>
                                            <select className="form-select" value={importancia} onChange={(e) => setImportancia(e.target.value)}>
                                                <option value="">Seleccionar...</option>
                                                <option value="alta">Alta</option>
                                                <option value="media">Media</option>
                                                <option value="baja">Baja</option>
                                            </select>
                                        </div>
                                        <div className="text-center">
                                            <button type="button" className="btn btn-secondary me-2" onClick={() => console.log('Cancelar')}>
                                                Cancelar
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-secondary me-2"
                                                style={{
                                                    backgroundColor: '#563A9C',
                                                    color: 'white'
                                                }}
                                                onClick={agregarCita}
                                            >
                                                Agendar Cita
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                    ) : (
                        // Estado de citas
                        <div>
    <h3 className="text-center">Estado de Citas</h3>
    <table className="table table-striped">
        <thead>
            <tr>
                <th>Paciente</th>
                <th>Estado</th>
                <th>Método</th>
            </tr>
        </thead>
        <tbody>
    {agendamientos.map((ag) => (
        <tr key={ag.id}>
            <td>
                {ag.paciente_nombre} (Dueño: {ag.cliente_nombre} {ag.cliente_apellido})
            </td>
            <td>
                {ag.estado === 'pendiente' ? (
                    <>
                        <button
                            className="btn btn-success btn-sm me-2"
                            onClick={() => actualizarEstado(ag.id, 'confirmado')}
                        >
                            Confirmar
                        </button>
                        <button
                            className="btn btn-danger btn-sm"
                            onClick={() => actualizarEstado(ag.id, 'cancelado')}
                        >
                            Cancelar
                        </button>
                    </>
                ) : (
                    <span
                        className={`badge ${
                            ag.estado === 'confirmado'
                                ? 'bg-success'
                                : ag.estado === 'cancelado'
                                ? 'bg-danger'
                                : 'bg-warning'
                        }`}
                    >
                        {ag.estado.charAt(0).toUpperCase() + ag.estado.slice(1)}
                    </span>
                )}
            </td>
            <td>
                {ag.estado === 'confirmado' && !ag.metodo_confirmacion ? (
                    <>
                        <button
                            className="btn btn-info btn-sm me-2"
                            onClick={() => actualizarEstado(ag.id, 'confirmado', 'online')}
                        >
                            Online
                        </button>
                        <button
                            className="btn btn-warning btn-sm me-2"
                            onClick={() => actualizarEstado(ag.id, 'confirmado', 'persona')}
                        >
                            En Persona
                        </button>
                        <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => actualizarEstado(ag.id, 'confirmado', 'llamada')}
                        >
                            Llamada
                        </button>
                    </>
                ) : ag.metodo_confirmacion ? (
                    <span className="badge bg-primary">
                        {ag.metodo_confirmacion.charAt(0).toUpperCase() +
                            ag.metodo_confirmacion.slice(1)}
                    </span>
                ) : (
                    '--'
                )}
            </td>
        </tr>
    ))}
</tbody>
    </table>
</div>

                    )}

                </div>

            </div>
            
        );
    };

export default Agendamientos;
