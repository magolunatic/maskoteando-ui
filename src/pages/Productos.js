import React, { useState, useEffect } from 'react';
import axios from 'axios';


const Productos = () => {
    const [productos, setProductos] = useState([]);
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [costo, setCosto] = useState('');
    const [precio_venta, setPrecio_venta] = useState('');
    const [stock, setStock] = useState('');
    const [errores, setErrores] = useState({
        nombre: '',
        descripcion: '',
        costo: '',
        precio_venta: '',
        stock: ''
    });

    useEffect(() => {
        const token = localStorage.getItem('access_token');

        axios.get('http://localhost:8000/api/productos/', {
            headers: {
                Authorization: `Bearer ${token}`, 
            },
        })
        .then(response => {
            setProductos(response.data);
        })
        .catch(error => console.error(error));
    }, []);

    const validarCampo = (campo, valor) => {
        switch (campo) {
            case 'nombre':
                if (!/^[a-zA-Z\s]+$/.test(valor)) {
                    setErrores(prev => ({ ...prev, nombre: 'Solo se permiten letras y espacios' }));
                } else {
                    setErrores(prev => ({ ...prev, nombre: '' }));
                }
                break;
            case 'descripcion':
                if (valor.trim() === '') {
                    setErrores(prev => ({ ...prev, descripcion: 'La descripción es obligatoria' }));
                } else {
                    setErrores(prev => ({ ...prev, descripcion: '' }));
                }
                break;
            case 'costo':
                if (isNaN(valor) || parseFloat(valor) <= 0) {
                    setErrores(prev => ({ ...prev, costo: 'El costo debe ser un número positivo' }));
                } else {
                    setErrores(prev => ({ ...prev, costo: '' }));
                }
                break;
            case 'precio_venta':
                if (isNaN(valor) || parseFloat(valor) <= 0) {
                    setErrores(prev => ({ ...prev, precio_venta: 'El precio de venta debe ser un número positivo' }));
                } else {
                    setErrores(prev => ({ ...prev, precio_venta: '' }));
                }
                break;
            case 'stock':
                if (isNaN(valor) || parseInt(valor, 10) <= 0) {
                    setErrores(prev => ({ ...prev, stock: 'El stock debe ser un número entero positivo' }));
                } else {
                    setErrores(prev => ({ ...prev, stock: '' }));
                }
                break;
            default:
                break;
        }
    };

    const agregarProducto = () => {
        if (
            errores.nombre ||
            errores.descripcion ||
            errores.costo ||
            errores.precio_venta ||
            errores.stock ||
            !nombre ||
            !descripcion ||
            !costo ||
            !precio_venta ||
            !stock
        ) {
            alert('Por favor corrige los errores en el formulario antes de continuar.');
            return;
        }

        const token = localStorage.getItem('access_token');

        const nuevoProducto = {
            nombre,
            descripcion,
            costo: parseFloat(costo),
            precio_venta: parseFloat(precio_venta),
            stock: parseInt(stock, 10)
        };

        axios
            .post('http://localhost:8000/api/productos/', nuevoProducto, {
                headers: {
                    Authorization: `Bearer ${token}`, 
                },
            })
            .then(response => setProductos([...productos, response.data]))
            .catch(error => {
                console.error("Error al agregar el producto:", error.response.data);
            });

        setNombre('');
        setDescripcion('');
        setCosto('');
        setPrecio_venta('');
        setStock('');
    };

    const eliminarProducto = (id) => {
        const token = localStorage.getItem('access_token');

        axios.delete(`http://localhost:8000/api/productos/${id}/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then(() => setProductos(productos.filter(producto => producto.id !== id)))
        .catch(error => console.error(error));
    };

    return (
        <div className="container" style={{ position: 'relative' }}>
            <div 
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: `url('/images/perro2.png')`, // Ruta de la imagen de fondo
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    zIndex: -1,
                }}
            ></div>
            
            <h1 className="text-center">Productos</h1>
            <div className="text-center mb-4">
                <img src="/images/maskoteando.png" alt="Logo" className="img-fluid" style={{ maxWidth: '350px' }} />
            </div>
            <div className="row">
                {/* Formulario para agregar productos */}
                <div className="col-md-6"style={{ maxWidth: '500px', margin: '0 auto' }}>
                    <div className="card" style={{ padding: '10px' }}>
                        <div className="card-body">
                            <h5 className="card-title text-center">Registro de Productos</h5>
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
                                    <label htmlFor="descripcion" className="form-label">Descripción</label>
                                    <textarea 
                                        className="form-control" 
                                        id="descripcion" 
                                        rows="3"
                                        value={descripcion}
                                        onChange={(e) => {
                                            setDescripcion(e.target.value);
                                            validarCampo('descripcion', e.target.value);
                                        }}
                                    ></textarea>
                                    {errores.descripcion && <small className="text-danger">{errores.descripcion}</small>}
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="costo" className="form-label">Costo</label>
                                    <input 
                                        type="number" 
                                        className="form-control" 
                                        id="costo" 
                                        value={costo}
                                        onChange={(e) => {
                                            setCosto(e.target.value);
                                            validarCampo('costo', e.target.value);
                                        }} 
                                    />
                                    {errores.costo && <small className="text-danger">{errores.costo}</small>}
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="precio_venta" className="form-label">Precio Venta</label>
                                    <input 
                                        type="number" 
                                        className="form-control" 
                                        id="precio_venta" 
                                        value={precio_venta}
                                        onChange={(e) => {
                                            setPrecio_venta(e.target.value);
                                            validarCampo('precio_venta', e.target.value);
                                        }} 
                                    />
                                    {errores.precio_venta && <small className="text-danger">{errores.precio_venta}</small>}
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="stock" className="form-label">Stock</label>
                                    <input 
                                        type="number" 
                                        className="form-control" 
                                        id="stock" 
                                        value={stock}
                                        onChange={(e) => {
                                            setStock(e.target.value);
                                            validarCampo('stock', e.target.value);
                                        }} 
                                    />
                                    {errores.stock && <small className="text-danger">{errores.stock}</small>}
                                </div>
                                <button 
                                    type="button" 
                                    className="btn  w-100" style={{
                                        backgroundColor: '#563A9C',
                                        color: 'white',
                                        border: 'none',
                                        padding: '10px 20px',
                                        fontSize: '16px',
                                        borderRadius: '5px',
                                        display: 'block', // Para centrar con margin auto
                                        margin: '0 auto'
                                        }}
                                    onClick={agregarProducto}>
                                    Agregar
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Lista de productos */}
                <div className="col-md-6">
                    <h3 className="text-center">Listado de Productos</h3>
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th scope="col">Nombre</th>
                                <th scope="col">Descripción</th>
                                <th scope="col">Costo</th>
                                <th scope="col">Precio Venta</th>
                                <th scope="col">Stock</th>
                                <th scope="col">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productos.map((producto) => (
                                <tr key={producto.id}>
                                    <td>{producto.nombre}</td>
                                    <td>{producto.descripcion}</td>
                                    <td>{producto.costo}</td>
                                    <td>{parseInt(producto.precio_venta)}</td>
                                    <td>{producto.stock}</td>
                                    <td>
                                        <button 
                                            className="btn  btn-danger w-2" 
                                            onClick={() => eliminarProducto(producto.id)}>
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

export default Productos;
