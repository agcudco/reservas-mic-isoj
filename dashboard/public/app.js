let currentEventoId = null;
let eventSource = null;
let asientosMap = new Map();

// Cargar lista de eventos al iniciar
async function loadEventos() {
    const select = document.getElementById('evento-select');
    try {
        const res = await fetch('/api/eventos');
        const eventos = await res.json();
        select.innerHTML = '';
        eventos.forEach(ev => {
            const opt = document.createElement('option');
            opt.value = ev.id;
            opt.textContent = ev.nombre;
            select.appendChild(opt);
        });
        // Seleccionar el primero
        if (eventos.length > 0) {
            select.value = eventos[0].id;
            select.dispatchEvent(new Event('change'));
        } else {
            select.innerHTML = '<option value="">No hay eventos</option>';
        }
    } catch (error) {
        select.innerHTML = '<option value="">Error cargando eventos</option>';
    }
}

// Cargar asientos de un evento
async function loadAsientos(eventoId) {
    try {
        const res = await fetch(`/api/asientos/${eventoId}`);
        const asientos = await res.json();
        asientosMap.clear();
        asientos.forEach(a => asientosMap.set(a.id, a));
        renderAsientos(asientos);
    } catch (error) {
        console.error('Error cargando asientos:', error);
    }
}

// Renderizar los asientos en la grilla
function renderAsientos(asientos) {
    const grid = document.getElementById('asientos-grid');
    grid.innerHTML = '';
    if (!asientos || asientos.length === 0) {
        grid.innerHTML = '<p>No hay asientos para este evento</p>';
        return;
    }
    asientos.forEach(asiento => {
        const div = document.createElement('div');
        div.className = `asiento ${asiento.estado}`;
        div.textContent = asiento.numero;
        div.dataset.id = asiento.id;
        grid.appendChild(div);
    });
}

// Actualizar un asiento específico
function updateAsiento(update) {
    const { asientoId, estado, numero } = update;
    const asiento = asientosMap.get(asientoId);
    if (asiento) {
        asiento.estado = estado;
        // Buscar el elemento en el DOM y actualizar clase
        const grid = document.getElementById('asientos-grid');
        const elements = grid.querySelectorAll('.asiento');
        for (let el of elements) {
            if (el.dataset.id === asientoId) {
                el.className = `asiento ${estado}`;
                break;
            }
        }
    }
}

// Conectar SSE para un evento
function connectSSE(eventoId) {
    if (eventSource) {
        eventSource.close();
        eventSource = null;
    }
    // Construir URL del SSE (ajustar puerto del microservicio de eventos)
    const sseUrl = `http://localhost:3000/sse/evento/${eventoId}`;
    eventSource = new EventSource(sseUrl);
    eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log('SSE update:', data);
        updateAsiento(data);
    };
    eventSource.onerror = (error) => {
        console.error('SSE error:', error);
        // Intentar reconectar después de 3 segundos
        setTimeout(() => {
            if (eventSource && eventSource.readyState === EventSource.CLOSED) {
                connectSSE(eventoId);
            }
        }, 3000);
    };
}

// Evento al cambiar de evento
document.getElementById('evento-select').addEventListener('change', async (e) => {
    const eventoId = e.target.value;
    if (!eventoId) return;
    currentEventoId = eventoId;
    // Cargar información del evento (opcional)
    // Actualizar asientos
    await loadAsientos(eventoId);
    // Conectar SSE para este evento
    connectSSE(eventoId);
});

// Iniciar
loadEventos();