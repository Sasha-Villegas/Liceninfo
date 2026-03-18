// ============================================
// gemini.js - Integración con Gemini AI
// Parseo de planes de estudio de otras carreras
// ============================================

const GEMINI_API = window.location.origin;

/**
 * Envía el texto del plan de estudios al backend para que Gemini lo procese
 */
async function procesarPlanConGemini() {
    const textoInput = document.getElementById('planTexto');
    const nombreInput = document.getElementById('nombreCarrera');
    const btnProcesar = document.getElementById('btnProcesar');
    const resultadoDiv = document.getElementById('geminiResultado');

    if (!textoInput || !nombreInput) return;

    const texto = textoInput.value.trim();
    const nombre = nombreInput.value.trim();

    if (!nombre) {
        mostrarToast('❌ Ingresá el nombre de la carrera', 'error');
        return;
    }
    if (texto.length < 50) {
        mostrarToast('❌ El texto del plan es muy corto. Pegá el plan completo.', 'error');
        return;
    }

    // Estado de carga
    btnProcesar.disabled = true;
    btnProcesar.innerHTML = '<span class="spinner"></span> Procesando con IA...';
    resultadoDiv.innerHTML = `
        <div class="loading-ai">
            <div class="ai-spinner"></div>
            <p>🤖 Gemini está analizando el plan de estudios...</p>
            <p style="font-size:0.9rem; color: var(--text-secondary);">Esto puede tardar unos segundos</p>
        </div>
    `;
    resultadoDiv.style.display = 'block';

    try {
        const response = await fetch(`${GEMINI_API}/api/careers/parse`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nombre: nombre,
                texto_plan: texto
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Error al procesar el plan');
        }

        const data = await response.json();

        // Mostrar resultado parseado
        mostrarResultadoCarrera(data, resultadoDiv);
        mostrarToast('✅ Plan procesado exitosamente', 'success');

    } catch (err) {
        console.error('Error procesando plan:', err);
        resultadoDiv.innerHTML = `
            <div style="text-align:center; padding:2rem; color: #ef4444;">
                <p style="font-size:2rem;">❌</p>
                <p><strong>Error al procesar el plan</strong></p>
                <p style="font-size:0.9rem; color: var(--text-secondary);">${err.message}</p>
                <p style="font-size:0.85rem; margin-top:1rem; color: var(--text-secondary);">Asegurate de que el backend está corriendo y la API key de Gemini está configurada en .env</p>
            </div>
        `;
    } finally {
        btnProcesar.disabled = false;
        btnProcesar.innerHTML = '🤖 Procesar con IA';
    }
}

/**
 * Muestra el resultado de una carrera parseada por Gemini
 */
function mostrarResultadoCarrera(data, container) {
    const plan = data.plan || data;

    let html = `
        <div class="carrera-resultado">
            <div class="carrera-header-resultado">
                <h3>🎓 ${data.nombre || 'Carrera'}</h3>
                ${data.duracion ? `<span class="carrera-duracion">📅 ${data.duracion}</span>` : ''}
                ${data.total_materias ? `<span class="carrera-materias">📚 ${data.total_materias} materias</span>` : ''}
            </div>

            <div class="carrera-acciones">
                <button class="btn-guardar-carrera" onclick="guardarCarrera(${JSON.stringify(data).replace(/"/g, '&quot;')})">
                    💾 Guardar Carrera
                </button>
            </div>
    `;

    // Renderizar el plan igual que el de Lic. en Informática
    if (plan && plan.length > 0) {
        html += plan.map(cuat => `
            <div class="cuatrimestre-section">
                <div class="cuatrimestre-header">📖 ${cuat.nombre || 'Cuatrimestre ' + cuat.cuatrimestre}</div>
                <div class="materias-grid">
                    ${(cuat.materias || []).map(m => `
                        <div class="materia-card ${m.tipo || 'regular'}">
                            <div class="materia-name">${m.nombre}</div>
                            <div class="materia-type">${tipoLabel(m.tipo || 'regular')}</div>
                            ${m.correlativas ? `<div class="materia-correlativas">🔗 ${m.correlativas}</div>` : ''}
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('');
    }

    html += `</div>`;
    container.innerHTML = html;
}

/**
 * Guarda una carrera en el backend
 */
async function guardarCarrera(data) {
    try {
        const response = await fetch(`${GEMINI_API}/api/careers`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            // También guardar en localStorage como cache
            const guardadas = JSON.parse(localStorage.getItem('carrerasGuardadas') || '[]');
            const yaExiste = guardadas.findIndex(c => c.nombre === data.nombre);
            if (yaExiste >= 0) {
                guardadas[yaExiste] = data;
            } else {
                guardadas.push(data);
            }
            localStorage.setItem('carrerasGuardadas', JSON.stringify(guardadas));

            mostrarToast('✅ Carrera guardada correctamente', 'success');
            cargarCarrerasGuardadas();
        } else {
            // Si el backend no está, guardar solo en localStorage
            throw new Error('Backend no disponible');
        }
    } catch (err) {
        console.warn('Backend no disponible, guardando en localStorage:', err);
        const guardadas = JSON.parse(localStorage.getItem('carrerasGuardadas') || '[]');
        const yaExiste = guardadas.findIndex(c => c.nombre === data.nombre);
        if (yaExiste >= 0) {
            guardadas[yaExiste] = data;
        } else {
            guardadas.push(data);
        }
        localStorage.setItem('carrerasGuardadas', JSON.stringify(guardadas));
        mostrarToast('💾 Carrera guardada localmente (backend no disponible)', 'warning');
        cargarCarrerasGuardadas();
    }
}

/**
 * Carga y muestra las carreras guardadas
 */
async function cargarCarrerasGuardadas() {
    const container = document.getElementById('carrerasGuardadas');
    if (!container) return;

    let carreras = [];

    // Intentar cargar del backend primero
    try {
        const response = await fetch(`${GEMINI_API}/api/careers`);
        if (response.ok) {
            carreras = await response.json();
        } else {
            throw new Error('Backend no disponible');
        }
    } catch (err) {
        // Fallback a localStorage
        carreras = JSON.parse(localStorage.getItem('carrerasGuardadas') || '[]');
    }

    if (carreras.length === 0) {
        container.innerHTML = `
            <div style="text-align:center; padding:2rem; color: var(--text-secondary);">
                <p style="font-size:2rem;">📭</p>
                <p>No hay carreras guardadas todavía</p>
                <p style="font-size:0.85rem;">Pegá un plan de estudios arriba y procesalo con IA</p>
            </div>
        `;
        return;
    }

    container.innerHTML = `
        <h3 style="margin-bottom:1rem; color: var(--text-primary);">📋 Carreras Guardadas</h3>
        <div class="carreras-grid">
            ${carreras.map((c, i) => `
                <div class="carrera-saved-card" onclick="verCarreraGuardada(${i})">
                    <div class="carrera-saved-icon">🎓</div>
                    <div class="carrera-saved-info">
                        <strong>${c.nombre || 'Carrera ' + (i + 1)}</strong>
                        <span>${c.total_materias ? c.total_materias + ' materias' : ''} ${c.duracion || ''}</span>
                    </div>
                    <button class="btn-delete-carrera" onclick="event.stopPropagation(); eliminarCarrera(${i})" title="Eliminar">🗑️</button>
                </div>
            `).join('')}
        </div>
    `;
}

/**
 * Muestra una carrera guardada en detalle
 */
async function verCarreraGuardada(index) {
    let carreras = [];
    try {
        const response = await fetch(`${GEMINI_API}/api/careers`);
        if (response.ok) carreras = await response.json();
        else throw new Error();
    } catch {
        carreras = JSON.parse(localStorage.getItem('carrerasGuardadas') || '[]');
    }

    const carrera = carreras[index];
    if (!carrera) return;

    const resultadoDiv = document.getElementById('geminiResultado');
    if (resultadoDiv) {
        resultadoDiv.style.display = 'block';
        mostrarResultadoCarrera(carrera, resultadoDiv);
    }
}

/**
 * Elimina una carrera guardada
 */
async function eliminarCarrera(index) {
    if (!confirm('¿Seguro que querés eliminar esta carrera?')) return;

    // Eliminar de localStorage
    const guardadas = JSON.parse(localStorage.getItem('carrerasGuardadas') || '[]');
    guardadas.splice(index, 1);
    localStorage.setItem('carrerasGuardadas', JSON.stringify(guardadas));

    // Intentar eliminar del backend también
    try {
        await fetch(`${GEMINI_API}/api/careers/${index}`, { method: 'DELETE' });
    } catch (err) {
        console.warn('No se pudo eliminar del backend:', err);
    }

    mostrarToast('🗑️ Carrera eliminada', 'info');
    cargarCarrerasGuardadas();
}

/**
 * Cierra el modal de Gemini (placeholder, se usa para la tecla Escape)
 */
function cerrarModalGemini() {
    const resultadoDiv = document.getElementById('geminiResultado');
    // No cerramos el resultado automáticamente, solo modales
}
