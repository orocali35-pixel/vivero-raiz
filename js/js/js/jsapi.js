const API_URL = "https://mockapi.io";
let plantas = [];

document.addEventListener("DOMContentLoaded", () => {
    const esIntranet = window.location.pathname.includes("listado.html") || window.location.pathname.includes("planta-form.html");
    const sesionActiva = localStorage.getItem("usuario_nombre");

    if (esIntranet && !sesionActiva) {
        window.location.href = "login.html";
        return;
    }

    if (document.querySelector(".contenedor-plantas") && window.location.pathname.includes("catalogo.html")) {
        inicializarCatálogo();
    } else if (document.getElementById("tabla-plantas-cuerpo") || window.location.pathname.includes("listado.html")) {
        cargarIntranet();
    } else if (window.location.pathname.includes("planta-form.html")) {
        configurarFormulario();
    } else if (window.location.pathname.includes("planta.html")) {
        cargarFichaIndividual();
    }

    const buscador = document.getElementById("buscador");
    const filtroCategoria = document.getElementById("filtro-categoria");
    const orden = document.getElementById("orden");
    const btnLimpiar = document.getElementById("btn-limpiar");

    if (buscador) buscador.addEventListener("input", aplicarFiltros);
    if (filtroCategoria) filtroCategoria.addEventListener("change", aplicarFiltros);
    if (orden) orden.addEventListener("change", aplicarFiltros);
    if (btnLimpiar) {
        btnLimpiar.addEventListener("click", () => {
            if (buscador) buscador.value = "";
            if (filtroCategoria) filtroCategoria.value = "todos";
            if (orden) orden.value = "defecto";
            renderizarTarjetas(plantas);
        });
    }
});

async function inicializarCatálogo() {
    const contenedor = document.querySelector(".contenedor-plantas");
    contenedor.innerHTML = "<p>Cargando variedades del vivero...</p>";

    try {
        const respuesta = await fetch(API_URL);
        plantas = await respuesta.json();
    } catch {
        plantas = plantasDeRespaldo;
    }
    renderizarTarjetas(plantas);
}

function renderizarTarjetas(lista) {
    const contenedor = document.querySelector(".contenedor-plantas");
    if (!contenedor) return;
    contenedor.innerHTML = "";

    lista.forEach(p => {
        contenedor.innerHTML += `
            <article class="producto-card">
                <img src="img/${p.imagen || 'sansevieria.jpg'}" alt="${p.nombre}">
                <h3>${p.nombre}</h3>
                <p class="cientifico">${p.nombreCientifico || ''}</p>
                <p class="info-planta">Categoría: ${p.categoria} · Riego: ${p.riego || 'Medio'}</p>
                <span class="precio">$${p.precio}</span>
                <a href="planta.html?id=${p.id}" class="btn-detalle">Ver detalle</a>
            </article>
        `;
    });
}

function aplicarFiltros() {
    let filtradas = [...plantas];
    const buscar = document.getElementById("buscador")?.value.toLowerCase() || "";
    const cat = document.getElementById("filtro-categoria")?.value || "todos";
    const ord = document.getElementById("orden")?.value || "defecto";

    if (buscar !== "") filtradas = filtradas.filter(p => p.nombre.toLowerCase().includes(buscar));
    if (cat !== "todos") filtradas = filtradas.filter(p => p.categoria === cat);
    if (ord === "precio-asc") filtradas.sort((a, b) => a.precio - b.precio);
    else if (ord === "precio-desc") filtradas.sort((a, b) => b.precio - a.precio);

    renderizarTarjetas(filtradas);
}

async function cargarIntranet() {
    const tbody = document.querySelector("table tbody");
    if (!tbody) return;
    tbody.id = "tabla-plantas-cuerpo";
    tbody.innerHTML = "<tr><td colspan='6' style='padding:12px;'>Cargando inventario de plantas...</td></tr>";

    try {
        const r = await fetch(API_URL);
        plantas = await r.json();
        tbody.innerHTML = "";
        plantas.forEach(p => {
            tbody.innerHTML += `
                <tr>
                    <td style="padding: 12px;">${p.id}</td>
                    <td style="padding: 12px; text-transform: capitalize; font-weight: bold;">${p.nombre}</td>
                    <td style="padding: 12px; text-transform: capitalize;">${p.categoria}</td>
                    <td style="padding: 12px;">$${p.precio}</td>
                    <td style="padding: 12px;">${p.stock || '10'}</td>
                    <td style="padding: 12px;">
                        <a href="planta-form.html?id=${p.id}" style="color: #2e5a44; font-weight: bold; text-decoration: none; margin-right:10px;">✏️ Editar</a> | 
                        <a href="#" onclick="eliminarPlanta('${p.id}')" style="color: #a30000; font-weight: bold; text-decoration: none;">❌ Eliminar</a>
                    </td>
                </tr>
            `;
        });
    } catch {
        tbody.innerHTML = "<tr><td colspan='6' style='padding:12px; color:red;'>Error al conectar con la API.</td></tr>";
    }
}

async function eliminarPlanta(id) {
    if (confirm("¿Estás seguro de que querés eliminar este producto de la base de datos?")) {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        alert("Planta dada de baja correctamente.");
        cargarIntranet();
    }
}

async function cargarFichaIndividual() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id") || "1";
    try {
        const r = await fetch(`${API_URL}/${id}`);
        const p = await r.json();
        
        document.querySelector("main h3").innerText = p.nombre;
        document.querySelector("main .cientifico").innerText = p.nombreCientifico || '';
        document.querySelector("main .precio").innerText = `$${p.precio}`;
        document.querySelector("main img").src = `img/${p.imagen || 'sansevieria.jpg'}`;
        
        const tds = document.querySelectorAll("table tbody td");
        if (tds.length >= 7) {
            tds[1].innerText = p.categoria;
            tds[3].innerText = p.luz || 'Media sombra';
            tds[5].innerText = p.aptaMascotas || 'No';
            tds[7].innerText = `${p.stock || '10'} unidades`;
        }
        document.querySelector("main p[style*='font-size: 0.95rem']").innerText = p.notas || `Riego ${p.riego}.`;
    } catch (e) {}
}

async function configurarFormulario() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    const form = document.querySelector("form");

    if (id) {
        document.querySelector("main h2").innerText = "Editar Planta Registrada";
        const r = await fetch(`${API_URL}/${id}`);
        const p = await r.json();
        
        document.getElementById("nombre").value = p.nombre || '';
        document.getElementById("nombreCientifico").value = p.nombreCientifico || '';
        document.getElementById("categoria").value = p.categoria || 'Interior';
        document.getElementById("riego").value = p.riego || 'medio';
        document.getElementById("precio").value = p.precio || 0;
        document.getElementById("stock").value = p.stock || 0;
        document.getElementById("fechaIngreso").value = p.fechaIngreso || '';
        document.getElementById("aptaMascotas").value = p.aptaMascotas || 'si';
        document.getElementById("foto").value = p.imagen || '';
        document.getElementById("notes").value = p.notas || '';
    }

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const payload = {
            nombre: document.getElementById("nombre").value,
            categoria: document.getElementById("categoria").value,
            precio: parseFloat(document.getElementById("precio").value),
            stock: parseInt(document.getElementById("stock").value),
            riego: document.getElementById("riego").value,
            nombreCientifico: document.getElementById("nombreCientifico").value,
            imagen: document.getElementById("foto").value || 'sansevieria.jpg'
        };

        if (id) {
            await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(payload)
            });
        } else {
            await fetch(API_URL, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(payload)
            });
        }
        alert("¡Datos guardados con éxito en el servidor!");
        window.location.href = "listado.html";
    });
}


