/**
 * SISTEMA DE GESTIÓN DE INVENTARIO - app.js
 */


const app = {
    productos: [],
    categorias: ['bebidas', 'postres', 'comidacafe', 'otros'],
    ventas: [],
    chart: null,

    init() {
        this.cargarDatosEjemplo();
        this.configurarEventos();
        this.renderAll();
    },

    cargarDatosEjemplo() {
        // Datos iniciales si no hay en localStorage
        const stored = localStorage.getItem('pro_inventario');
        if (stored) {
            this.productos = JSON.parse(stored);
        } else {
            this.productos = [
                { id: 1, nombre: 'Laptop Pro 15', categoria: 'Electronica', precio: 1200, stock: 5, descripcion: 'Intel i7, 16GB RAM' },
                { id: 2, nombre: 'Cafetera Express', categoria: 'Hogar', precio: 85, stock: 15, descripcion: '15 bares de presión' },
                { id: 3, nombre: 'Camiseta Algodón', categoria: 'Ropa', precio: 25, stock: 40, descripcion: '100% Algodón orgánico' }
            ];
            this.syncStorage();
        }
    },

    configurarEventos() {
        // Navegación de pestañas
        document.querySelectorAll('.nav-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const view = btn.dataset.view;
                this.switchView(view);
                
                document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });

        // Formulario
        document.getElementById('productForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.guardarProducto();
        });

        // Búsqueda en tiempo real
        document.getElementById('globalSearch').addEventListener('input', (e) => {
            this.renderTable(e.target.value);
        });

        // Filtro por categoría
        document.getElementById('filterCategory').addEventListener('change', (e) => {
            this.renderTable('', e.target.value);
        });
    },

    switchView(viewId) {
        document.querySelectorAll('.view').forEach(v => v.classList.add('hidden'));
        document.getElementById(`${viewId}-view`).classList.remove('hidden');
    },
 
    // CRUD - Create / Update
    async guardarProducto() {
        const id = document.getElementById('productId').value;
        const producto = {
            id: id ? parseInt(id) : Date.now(),
            nombre: document.getElementById('pName').value,
            categoria: document.getElementById('pCategory').value,
            precio: parseFloat(document.getElementById('pPrice').value),
            stock: parseInt(document.getElementById('pStock').value),
            descripcion: document.getElementById('pDesc').value
        };

        // Simulación de Fetch API (POST/PUT)
        if (id) {
            const index = this.productos.findIndex(p => p.id == id);
            this.productos[index] = producto;
        } else {
            this.productos.push(producto);
        }

        this.syncStorage();
        this.closeModal();
        this.renderTable();
        this.updateStats();
        alert('Producto guardado correctamente');
    },

    // CRUD - Delete
    eliminarProducto(id) {
        if (confirm('¿Estás seguro de eliminar este producto?')) {
            this.productos = this.productos.filter(p => p.id !== id);
            this.syncStorage();
            this.renderTable();
            this.updateStats();
            alert('Producto eliminado');
        }
    },

    // RENDERERS
    renderAll() {
    this.renderTable();
    this.updateStats();

    if (!this.chart) {
        this.renderChart();
    }
    },

    renderTable(search = '', category = 'all') {
        const tbody = document.getElementById('inventoryBody');
        tbody.innerHTML = '';

        const filtrados = this.productos.filter(p => {
            const matchSearch = p.nombre.toLowerCase().includes(search.toLowerCase());
            const matchCat = category === 'all' || p.categoria === category;
            return matchSearch && matchCat;
        });

        filtrados.forEach(p => {
            const row = document.createElement('tr');
            const stockClass = p.stock < 10 ? 'badge-low' : 'badge-ok';
            
            row.innerHTML = `
                <td><strong>${p.nombre}</strong></td>
                <td>${p.categoria}</td>
                <td>$${p.precio.toFixed(2)}</td>
                <td><span class="badge ${stockClass}">${p.stock} units</span></td>
                <td>
                    <button onclick="app.editModal(${p.id})" class="btn-icon"><i class="fas fa-edit"></i></button>
                    <button onclick="app.eliminarProducto(${p.id})" class="btn-icon text-danger"><i class="fas fa-trash"></i></button>
                </td>
            `;
            tbody.appendChild(row);
        });
    },

    updateStats() {
        const total = this.productos.length;
        const lowStock = this.productos.filter(p => p.stock < 10).length;
        
        document.getElementById('statTotalProducts').innerText = total;
        document.getElementById('statLowStock').innerText = lowStock;
        
        // Alerta visual de bajo stock
        const alertBadge = document.getElementById('lowStockAlert');
        if(lowStock > 0) alertBadge.classList.remove('hidden');
        else alertBadge.classList.add('hidden');

        // Renderizar lista lateral de bajo stock
        const lowList = document.getElementById('lowStockList');
        lowList.innerHTML = this.productos
            .filter(p => p.stock < 10)
            .map(p => `<li><i class="fas fa-exclamation-circle text-warning"></i> ${p.nombre} (${p.stock} unid.)</li>`)
            .join('');
    },

   renderChart() {

    const ctx = document
        .getElementById('salesChart')
        .getContext('2d');

    if (this.chart) {
        this.chart.destroy();
        this.chart = null;
    }

    this.chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
            datasets: [{
                label: 'Ventas 2026',
                data: [12000, 19000, 15000, 25000, 22000, 30000],
                borderColor: '#4f46e5',
                backgroundColor: 'rgba(79, 70, 229, 0.1)',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: false,
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
    },

    actualizarGraficoVentas() {

    if (!this.chart) return;

    this.chart.data.labels = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'];

    this.chart.data.datasets[0].data = [
        12000,
        19000,
        15000,
        25000,
        22000,
        30000
    ];

    this.chart.update();
    },

    // UTILS
    syncStorage() {
        localStorage.setItem('pro_inventario', JSON.stringify(this.productos));
    },

    openModal() {
        document.getElementById('productForm').reset();
        document.getElementById('productId').value = '';
        document.getElementById('modalTitle').innerText = 'Nuevo Producto';
        document.getElementById('productModal').style.display = 'block';
    },

    editModal(id) {
        const p = this.productos.find(x => x.id === id);
        document.getElementById('productId').value = p.id;
        document.getElementById('pName').value = p.nombre;
        document.getElementById('pCategory').value = p.categoria;
        document.getElementById('pPrice').value = p.precio;
        document.getElementById('pStock').value = p.stock;
        document.getElementById('pDesc').value = p.descripcion;
        
        document.getElementById('modalTitle').innerText = 'Editar Producto';
        document.getElementById('productModal').style.display = 'block';
    },

    closeModal() {
        document.getElementById('productModal').style.display = 'none';
    }
};

// Iniciar aplicación
document.addEventListener('DOMContentLoaded', () => app.init());