import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx'; // Importamos la librería xlsx

const Ventas = () => {
    const [ventas, setVentas] = useState([]);
    const [productos, setProductos] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [productoId, setProductoId] = useState('');
    const [cantidad, setCantidad] = useState('');
    const [precio, setPrecio_venta] = useState('');
    const [clienteId, setClienteId] = useState('');
    const [fechaVenta, setFechaVenta] = useState('');
    const [total, setTotal] = useState(0);
    const [errores, setErrores] = useState('');
    const [busqueda, setBusqueda] = useState(''); // Estado para la búsqueda

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        const headers = { Authorization: `Bearer ${token}` };

        // Cargar ventas
        axios.get('http://localhost:8000/api/ventas/', { headers })
            .then(response => setVentas(response.data))
            .catch(() => setErrores('Error al cargar ventas.'));

        // Cargar productos
        axios.get('http://localhost:8000/api/productos/', { headers })
            .then(response => setProductos(response.data))
            .catch(() => setErrores('Error al cargar productos.'));

        // Cargar clientes
        axios.get('http://localhost:8000/api/clientes/', { headers })
            .then(response => setClientes(response.data))
            .catch(() => setErrores('Error al cargar clientes.'));
    }, []);

    const handleProductoChange = (productoId) => {
        setProductoId(productoId);

        // Buscar el producto seleccionado y actualizar el precio
        const productoSeleccionado = productos.find(producto => producto.id === parseInt(productoId));
        if (productoSeleccionado) {
            setPrecio_venta(productoSeleccionado.precio_venta); // Asignar el precio de venta del producto
            calcularTotal(cantidad, productoSeleccionado.precio_venta); // Recalcular el total
        } else {
            setPrecio_venta(''); // Si no se selecciona un producto válido, limpiar el precio
        }
    };

    const calcularTotal = (cantidad, precio) => {
        if (cantidad && precio) {
            setTotal(Number(cantidad) * Number(precio));
        } else {
            setTotal(0); // Si no hay cantidad o precio, total es 0
        }
    };

    const handleCantidadChange = (e) => {
        const cantidad = e.target.value;
        setCantidad(cantidad);
        calcularTotal(cantidad, precio); // Recalcular total al cambiar la cantidad
    };

    const agregarVenta = () => {
        const token = localStorage.getItem('access_token');

        if (!productoId || !cantidad || !precio || !clienteId || !fechaVenta) {
            setErrores('Por favor, completa todos los campos.');
            return;
        }

        if (Number(cantidad) <= 0 || Number(precio) <= 0 || Number(total) <= 0) {
            setErrores('La cantidad, precio y total deben ser mayores a cero.');
            return;
        }

        const nuevaVenta = {
            producto: productoId,
            cantidad,
            precio,
            cliente: clienteId,
            fecha_venta: fechaVenta,
            total,
        };

        axios.post('http://localhost:8000/api/ventas/', nuevaVenta, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        })
            .then(response => {
                setVentas([...ventas, response.data]);
                setErrores('');
           // Recargar productos para reflejar el nuevo stock( cargue nuevo)
           return axios.get('http://localhost:8000/api/productos/', { 
            headers: { Authorization: `Bearer ${token}` } 
        });
    })
    .then(response => {
        setProductos(response.data);
    })
    .catch(err => {
        if (err.response && err.response.data.detail) {
            setErrores(err.response.data.detail);
        } else {
            setErrores('Error al agregar la venta o al recargar productos.');
        }
    }); //hasta aca

        setProductoId('');
        setCantidad('');
        setPrecio_venta('');
        setClienteId('');
        setFechaVenta('');
        setTotal(0);
    };

    // Filtrar las ventas según la búsqueda
    const ventasFiltradas = ventas.filter(venta => {
        const cliente = clientes.find(c => c.id === venta.cliente);
        const producto = productos.find(p => p.id === venta.producto);

        const textoCliente = cliente ? `${cliente.nombre} ${cliente.apellido}` : '';
        const textoProducto = producto ? producto.nombre : '';

        // Verificar si la búsqueda coincide con el cliente o el producto
        return textoCliente.toLowerCase().includes(busqueda.toLowerCase()) ||
               textoProducto.toLowerCase().includes(busqueda.toLowerCase());
    });
    // Función para exportar a Excel
    const exportarExcel = () => {
        // Procesamos los datos para exportar
        const datosExportar = ventas.map((venta) => {
            const producto = productos.find((p) => p.id === venta.producto);
            const cliente = clientes.find((c) => c.id === venta.cliente);
    
            return {
                Producto: producto ? producto.nombre : "Desconocido", // Nombre del producto
                Cantidad: venta.cantidad,
                Precio: venta.precio_venta,
                Total: venta.total,
                "Fecha de Venta": venta.fecha_venta,
                Cliente: cliente
                ? `${cliente.nombre} ${cliente.apellido}` // Nombre completo del cliente
                : "Desconocido",
                Estado: venta.anulada ? "Anulada" : "Procesado", // Estado personalizado
            };
        });
    
        // Convertimos los datos procesados a una hoja de Excel
        const ws = XLSX.utils.json_to_sheet(datosExportar);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Ventas");
    
        // Descargamos el archivo
        XLSX.writeFile(wb, "ventas.xlsx");
    };
    // Función para imprimir la lista de ventas
    const imprimirVentas = () => {
        const printWindow = window.open('', '', 'height=600,width=800');
        printWindow.document.write('<html><head><title>Lista de Ventas</title></head><body>');
        printWindow.document.write('<h1>Lista de Ventas</h1>');
        printWindow.document.write('<table border="1" style="width: 100%; border-collapse: collapse; text-align: left;">');
        printWindow.document.write('<thead><tr>');
        printWindow.document.write('<th>Producto</th>');
        printWindow.document.write('<th>Cantidad</th>');
        printWindow.document.write('<th>Precio</th>');
        printWindow.document.write('<th>Total</th>');
        printWindow.document.write('<th>Fecha de Venta</th>');
        printWindow.document.write('<th>Cliente</th>');
        printWindow.document.write('<th>Estado</th>');
        printWindow.document.write('</tr></thead><tbody>');
    
        // Procesamos y mostramos cada venta
        ventas.forEach((venta) => {
            const producto = productos.find((p) => p.id === venta.producto);
            const cliente = clientes.find((c) => c.id === venta.cliente);
    
            printWindow.document.write('<tr>');
            printWindow.document.write(`<td>${producto ? producto.nombre : "Desconocido"}</td>`); // Nombre del producto
            printWindow.document.write(`<td>${venta.cantidad}</td>`);
            printWindow.document.write(`<td>${venta.precio_venta}</td>`);
            printWindow.document.write(`<td>${venta.total}</td>`);
            printWindow.document.write(`<td>${venta.fecha_venta}</td>`);
            printWindow.document.write(`<td>${cliente ? `${cliente.nombre} ${cliente.apellido}` : "Cliente desconocido"}</td>`); // Nombre del cliente
            printWindow.document.write(`<td>${venta.anulada ? "Anulada" : "Procesado"}</td>`); // Estado personalizado
            printWindow.document.write('</tr>');
        });
    
        printWindow.document.write('</tbody></table>');
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.print();
    };

    const anularVenta = (id) => {
        const token = localStorage.getItem('access_token');
    
        axios.post(`http://localhost:8000/api/ventas/${id}/anular/`, {}, {
            headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => {
            // Actualiza la lista de ventas
            setVentas(ventas.map(venta => 
                venta.id === id ? { ...venta, anulada: true } : venta
            ));
            // Recarga los productos para reflejar el stock actualizado
            return axios.get('http://localhost:8000/api/productos/', {
                headers: { Authorization: `Bearer ${token}` },
            });
        })
        .then(response => setProductos(response.data))
        .catch(() => setErrores('Error al anular la venta.'));
    };

    return (
        <div className="container">
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
            <h1 className="text-center">Ventas</h1>
            <div className="text-center mb-4">
                <img src="/images/maskoteando.png" alt="Logo" className="img-fluid" style={{ maxWidth: '350px' }} />
            </div>
            {errores && (
                <div className="alert alert-danger" role="alert">
                    {errores}
                </div>
            )}


            <div className="row">
                <div className="col-md-6 mb-4">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title text-center">Nueva Venta</h5>
                            <form>
                                <div className="mb-3">
                                    <label htmlFor="producto" className="form-label">Producto</label>
                                    <select 
                                        id="producto" 
                                        className="form-select" 
                                        value={productoId} 
                                        onChange={(e) => handleProductoChange(e.target.value)}>
                                        <option value="">Selecciona un producto</option>
                                        {productos.map(producto => (
                                            <option key={producto.id} value={producto.id}>
                                                {producto.nombre} - Stock: {producto.stock}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="cantidad" className="form-label">Cantidad</label>
                                    <input 
                                        type="number" 
                                        className="form-control" 
                                        id="cantidad" 
                                        value={cantidad}
                                        onChange={handleCantidadChange} 
                                        min="1"
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="precio" className="form-label">Precio</label>
                                    <input 
                                        type="number" 
                                        className="form-control" 
                                        id="precio" 
                                        value={precio}
                                        disabled 
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="total" className="form-label">Total</label>
                                    <input 
                                        type="number" 
                                        className="form-control" 
                                        id="total" 
                                        value={total}
                                        disabled 
                                    />
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
                                                {cliente.nombre} {cliente.apellido}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="fechaVenta" className="form-label">Fecha Venta</label>
                                    <input 
                                        type="date" 
                                        className="form-control" 
                                        id="fechaVenta" 
                                        value={fechaVenta} 
                                        onChange={(e) => setFechaVenta(e.target.value)} 
                                    />
                                </div>
                                <div className="text-center">
                                    <button type="button" 
                                    className="btn  w-100" style={{
                                        backgroundColor: '#563A9C',
                                        color: 'white',
                                        border: 'none',
                                        padding: '10px 20px',
                                        fontSize: '16px',
                                        borderRadius: '5px',
                                        display: 'block', // Para centrar con margin auto
                                        margin: '0 auto'
                                        }}onClick={agregarVenta}>Agregar</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <h3 className="text-center">Listado de Ventas</h3>
            
                    <div className="d-flex justify-content-between align-items-center mb-3">
                    {/* Botones */}
                        <div>
                            <button className="btn btn-success me-3" onClick={exportarExcel}>
                            <i className="bi bi-file-earmark-excel"></i> Exportar a Excel
                            </button>
                            <button className="btn btn-info" onClick={imprimirVentas}>
                            <i className="bi bi-printer"></i> Imprimir
                            </button>
                        </div>

                    {/* Input de búsqueda */}
                    <div className="input-group" style={{ maxWidth: '300px' }}>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Buscar ventas"
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                        />
                        <button className="btn btn-danger">
                        <i className="bi bi-search"></i>
                        </button>
                    </div>
                </div>
                <div className="card-body">
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th scope="col">Producto</th>
                                <th scope="col">Cantidad</th>
                                <th scope="col">Precio</th>
                                <th scope="col">Total</th>
                                <th scope="col">cliente</th>
                                <th scope="col">fecha de venta</th>
                                <th scope="col">Acciones</th>
                            </tr>
                        </thead>
        <tbody>
                    {ventasFiltradas.map(venta => {
                        const cliente = clientes.find(c => c.id === venta.cliente);
                        const producto = productos.find(p => p.id === venta.producto);

                        return (
                            <tr key={venta.id}>
                                <td>{producto ? producto.nombre : 'Producto desconocido'}</td>
                                <td>{venta.cantidad}</td>
                                <td>{venta.precio}</td>
                                <td>{venta.total}</td>
                                <td>{cliente ? `${cliente.nombre} ${cliente.apellido}` : 'Cliente desconocido'}</td>
                                <td>{venta.fecha_venta}</td>
                                <td>
                                    <button className="btn btn-warning">Anular</button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
                                <tbody>
                            {ventas.map((venta) => {
                                const cliente = clientes.find(c => c.id === venta.cliente);
                                const producto = productos.find(p => p.id === venta.producto);

                                return (
                                    <tr key={venta.id}>
                                        <td>{producto ? producto.nombre : 'Producto desconocido'}</td>
                                        <td>{venta.cantidad}</td>
                                        <td>{venta.precio_venta}</td>
                                        <td>{venta.total}</td>
                                        <td>{cliente ? `${cliente.nombre} ${cliente.apellido}` : 'Cliente desconocido'}</td>
                                        <td>{venta.fecha_venta}</td>
                                        <td>
                                            {venta.anulada ? (
                                                <span className="text-danger">Anulado</span>
                                            ) : (
                                                <button 
                                                    className="btn btn-warning"
                                                    onClick={() => anularVenta(venta.id)}>
                                                    Anular
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                            </table>
                        </div>
                </div>
            </div>
        </div>
    );
};

export default Ventas;
