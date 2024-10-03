import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Productos = () => {
    const [productos, setProductos] = useState([]);
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [costo, setCosto] = useState('');
    const [precio_venta, setPrecio_venta] = useState('');
    const [stock, setStock] = useState('');

    useEffect(() => {
        // Obtener el token de acceso desde el localStorage
        const token = localStorage.getItem('access_token');

        axios.get('http://localhost:8000/api/productos/', {
            headers: {
                Authorization: `Bearer ${token}`,  // Incluir el token en el encabezado
            },
        })
        .then(response => {
            setProductos(response.data);
            console.log('response.data', response.data);
        })
        .catch(error => console.error(error));
    }, []);

    const agregarProducto = () => {
        const token = localStorage.getItem('access_token'); // Obtener el token

        const nuevoProducto = {
            nombre,
            descripcion,
            costo: parseFloat(costo),          // Asegúrate de que 'costo' sea un número
            precio_venta: parseFloat(precio_venta),  // Asegúrate de que 'precio_venta' sea un número
            stock: parseInt(stock, 10)         // Asegúrate de que 'stock' sea un entero
        };

        axios.post('http://localhost:8000/api/productos/', nuevoProducto, {
            headers: {
                Authorization: `Bearer ${token}`,  // Incluir el token en el encabezado
            },
        })
        .then(response => setProductos([...productos, response.data]))
        .catch(error => {
            console.error("Error al agregar el producto:", error.response.data);
        });
    
        // Limpiar campos después de agregar
        setNombre('');
        setDescripcion('');
        setCosto('');
        setPrecio_venta('');
        setStock('');
    };

    const eliminarProducto = (id) => {
        const token = localStorage.getItem('access_token');  // Obtener el token

        axios.delete(`http://localhost:8000/api/productos/${id}/`, {
            headers: {
                Authorization: `Bearer ${token}`,  // Incluir el token en el encabezado
            },
        })
        .then(() => setProductos(productos.filter(producto => producto.id !== id)))
        .catch(error => console.error(error));
    };

    return (
        <div>
            <div className="container">
                <h1 className="text-center">Bienvenido al módulo de Productos</h1>
                <div className="card mx-auto" style={{ maxWidth: '600px' }}>
                    <div className="card-body">
                        <h5 className="card-title text-center">ABM de Productos</h5>
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
                                <label htmlFor="descripcion" className="form-label">Descripción</label>
                                <textarea 
                                    className="form-control" 
                                    id="descripcion" 
                                    rows="3"
                                    value={descripcion}
                                    onChange={(e) => setDescripcion(e.target.value)}
                                ></textarea>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="costo" className="form-label">Costo</label>
                                <input 
                                    type="number" 
                                    className="form-control" 
                                    id="costo" 
                                    value={costo}
                                    onChange={(e) => setCosto(e.target.value)} 
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="precio_venta" className="form-label">Precio Venta</label>
                                <input 
                                    type="number" 
                                    className="form-control" 
                                    id="precio_venta" 
                                    value={precio_venta}
                                    onChange={(e) => setPrecio_venta(e.target.value)} 
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="stock" className="form-label">Stock</label>
                                <input 
                                    type="number" 
                                    className="form-control" 
                                    id="stock" 
                                    value={stock}
                                    onChange={(e) => setStock(e.target.value)} 
                                />
                            </div>
                            <button 
                                type="button" 
                                className="btn btn-success w-100" 
                                onClick={agregarProducto}>
                                Agregar
                            </button>
                        </form>
                    </div>
                </div>

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
                                        className="btn btn-danger btn-sm" 
                                        onClick={() => eliminarProducto(producto.id)}>
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

export default Productos;
