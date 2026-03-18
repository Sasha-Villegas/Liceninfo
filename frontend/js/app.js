// ============================================
// app.js - Lógica principal de la aplicación
// Navegación, búsqueda, tema, menú mobile
// ============================================

/**
 * Navega a una sección/solapa de la app
 */
function showSection(sectionId) {
    // Desactivar todas las secciones
    document.querySelectorAll('.tab-section').forEach(section => {
        section.classList.remove('active');
    });
    // Activar la sección seleccionada
    const target = document.getElementById(sectionId);
    if (target) target.classList.add('active');

    // Actualizar nav activo
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('nav-active');
        if (link.getAttribute('data-section') === sectionId) {
            link.classList.add('nav-active');
        }
    });

    // Cerrar menú móvil
    document.getElementById('navLinks')?.classList.remove('active');

    // Scroll to top suave
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Inicializar contenido dinámico de la sección
    if (sectionId === 'alertas') {
        inicializarFiltrosAlertas();
        renderizarSolapaAlertas();
    } else if (sectionId === 'otras-carreras') {
        cargarCarrerasGuardadas();
    }
}

/**
 * Toggle tema oscuro/claro
 */
function toggleTheme() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', newTheme);

    const btn = document.querySelector('.theme-toggle');
    if (btn) btn.textContent = newTheme === 'dark' ? '☀️' : '🌙';

    localStorage.setItem('theme', newTheme);
}

/**
 * Carga el tema guardado en localStorage
 */
function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    const btn = document.querySelector('.theme-toggle');
    if (btn) btn.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
}

/**
 * Toggle menú mobile
 */
function toggleMobileMenu() {
    document.getElementById('navLinks')?.classList.toggle('active');
}

/**
 * Busca fechas en la base de datos
 */
function searchDates() {
    const searchTerm = document.getElementById('searchInput')?.value.toLowerCase();
    const results = document.getElementById('searchResults');
    if (!searchTerm || !results) return;

    if (searchTerm.length < 2) {
        results.classList.remove('active');
        return;
    }

    const filtered = fechasData.filter(item =>
        item.materia.toLowerCase().includes(searchTerm) ||
        item.nombre.toLowerCase().includes(searchTerm) ||
        item.tipo.toLowerCase().includes(searchTerm) ||
        item.fecha.includes(searchTerm)
    );

    if (filtered.length === 0) {
        results.innerHTML = '<p style="color: var(--text-secondary);">No se encontraron resultados</p>';
        results.classList.add('active');
        return;
    }

    results.innerHTML = filtered.map(item => {
        const fechaRef = item.fechaFin || item.fecha;
        const dias = diasHasta(fechaRef);
        const nivel = dias > 0 ? getNivelUrgencia(dias) : 'pasado';
        const emoji = dias > 0 ? getEmojiUrgencia(nivel) : '⚫';
        const diasText = dias > 0 ? `Faltan ${dias} días` : 'Ya pasó';

        return `
            <div class="search-result-item alert-border-${nivel}">
                <div style="display:flex;justify-content:space-between;align-items:center;">
                    <div>
                        <strong>${emoji} ${item.materia} - ${item.nombre}</strong><br>
                        <span style="color: var(--text-secondary);">${item.tipo} • ${formatearFechaAlerta(item)}</span>
                    </div>
                    <span class="search-dias ${nivel}">${diasText}</span>
                </div>
            </div>
        `;
    }).join('');
    results.classList.add('active');
}

/**
 * Renderiza el plan de estudios dinámicamente
 */
function renderizarPlanEstudios(plan, containerId = 'planContent') {
    const container = document.getElementById(containerId);
    if (!container || !plan) return;

    container.innerHTML = plan.map(cuat => `
        <div class="cuatrimestre-section">
            <div class="cuatrimestre-header">📖 Cuatrimestre ${cuat.cuatrimestre}${cuat.cuatrimestre === 12 ? ' - Trabajo Final' : ''}</div>
            <div class="materias-grid">
                ${cuat.materias.map(m => `
                    <div class="materia-card ${m.tipo}">
                        <div class="materia-name">${m.nombre}</div>
                        <div class="materia-type">${tipoLabel(m.tipo)}</div>
                    </div>
                `).join('')}
            </div>
            ${cuat.cuatrimestre === 12 ? `
                <div style="margin-top: 1rem; padding: 1rem; background: var(--bg-secondary); border-radius: 10px; border-left: 4px solid var(--accent-green);">
                    <strong>📝 Trabajo Final de Grado:</strong> Una vez obtenida la regularidad en Seminario Final, tendrás 18 meses máximo para aprobar tu Trabajo Final en una instancia de Defensa Oral.
                </div>
            ` : ''}
        </div>
    `).join('');
}

/**
 * Convierte el tipo de materia a su label legible
 */
function tipoLabel(tipo) {
    const labels = {
        'regular': 'Regular',
        'universitario': 'Universitario 21',
        'proceso': 'Materia de Proceso',
        'electiva': 'Electiva'
    };
    return labels[tipo] || tipo;
}

/**
 * Renderiza los enlaces útiles dinámicamente
 */
function renderizarEnlaces() {
    const container = document.getElementById('enlacesContent');
    if (!container) return;

    container.innerHTML = enlacesData.map(enlace => `
        <div class="link-card">
            <div class="link-card-icon">${enlace.icono}</div>
            <h3>${enlace.titulo}</h3>
            <p>${enlace.descripcion}</p>
            <a href="${enlace.url}" target="_blank" class="link-button">${enlace.boton}</a>
        </div>
    `).join('');
}

// ============================================
// Inicialización al cargar la página
// ============================================
document.addEventListener('DOMContentLoaded', function () {
    // Cargar tema guardado
    loadTheme();

    // Renderizar notificaciones de inicio
    renderizarNotificacionesInicio();

    // Renderizar plan de estudios
    renderizarPlanEstudios(planEstudios);

    // Renderizar enlaces
    renderizarEnlaces();

    // Buscador en tiempo real
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', searchDates);
        searchInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') searchDates();
        });
    }

    // Cerrar modal con Escape
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            cerrarModalEmail();
            cerrarModalGemini();
        }
    });
});
