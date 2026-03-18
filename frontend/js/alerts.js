// ============================================
// alerts.js - Sistema de alertas mejorado
// Colores semafóricos + compartir por email
// ============================================

// Configuración de la API del backend
const API_BASE = window.location.origin;

/**
 * Parsea una fecha en formato DD/MM/YYYY y retorna un objeto Date
 */
function parseFechaToDate(fechaStr) {
    const partes = fechaStr.trim().split('/');
    return new Date(parseInt(partes[2]), parseInt(partes[1]) - 1, parseInt(partes[0]));
}

/**
 * Calcula los días restantes hasta una fecha desde hoy
 * Usa la fecha real del sistema (no hardcodeada)
 */
function diasHasta(fechaStr) {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const fecha = parseFechaToDate(fechaStr);
    return Math.ceil((fecha - hoy) / (1000 * 60 * 60 * 24));
}

/**
 * Determina el nivel de urgencia según los días restantes
 * Retorna: 'rojo' (≤7), 'amarillo' (8-15), 'verde' (>15)
 */
function getNivelUrgencia(dias) {
    if (dias <= 7) return 'rojo';
    if (dias <= 15) return 'amarillo';
    return 'verde';
}

/**
 * Retorna el emoji del semáforo según el nivel
 */
function getEmojiUrgencia(nivel) {
    const emojis = { rojo: '🔴', amarillo: '🟡', verde: '🟢' };
    return emojis[nivel] || '⚪';
}

/**
 * Retorna el ícono según el tipo de evento
 */
function getIconoTipo(tipo) {
    const iconos = {
        'TP': '📝',
        'Parcial': '📋',
        'Recuperatorio': '🔄',
        'Final': '🎓'
    };
    return iconos[tipo] || '📌';
}

/**
 * Formatea la fecha para mostrar en la alerta
 * Si tiene fechaFin, muestra el rango
 */
function formatearFechaAlerta(item) {
    if (item.fechaFin) {
        return `${item.fecha} al ${item.fechaFin}`;
    }
    return item.fecha;
}

/**
 * Genera el texto para compartir una alerta
 */
function generarTextoAlerta(item, dias) {
    const tipo = item.tipo === 'TP' ? 'Trabajo Práctico' : item.tipo;
    const urgencia = dias <= 7 ? '⚠️ URGENTE' : dias <= 15 ? '📢 Próximamente' : 'ℹ️ Recordatorio';
    return `${urgencia}\n\n📚 Materia: ${item.materia}\n📋 Evento: ${tipo} - ${item.nombre}\n📅 Fecha: ${formatearFechaAlerta(item)}\n⏳ Faltan: ${dias} día${dias !== 1 ? 's' : ''}\n\n🎓 Portal Estudiantil - Lic. en Informática - Siglo 21`;
}

/**
 * Genera un link mailto: con la alerta pre-armada
 */
function generarMailtoLink(item, dias) {
    const asunto = encodeURIComponent(`[Liceninfo] ${item.materia} - ${item.nombre} (${dias} días)`);
    const cuerpo = encodeURIComponent(generarTextoAlerta(item, dias));
    return `mailto:?subject=${asunto}&body=${cuerpo}`;
}

/**
 * Envía alerta por email vía backend
 */
async function enviarAlertaEmail(item, dias, emailDestino) {
    try {
        const response = await fetch(`${API_BASE}/api/alerts/email`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                to_email: emailDestino,
                subject: `[Liceninfo] ${item.materia} - ${item.nombre} (${dias} días)`,
                materia: item.materia,
                tipo: item.tipo,
                nombre: item.nombre,
                fecha: formatearFechaAlerta(item),
                dias_restantes: dias
            })
        });

        if (response.ok) {
            mostrarToast('✅ Email enviado correctamente', 'success');
        } else {
            const error = await response.json();
            mostrarToast(`❌ Error: ${error.detail || 'No se pudo enviar el email'}`, 'error');
        }
    } catch (err) {
        // Si el backend no está disponible, usar mailto como fallback
        console.warn('Backend no disponible, usando mailto:', err);
        window.open(generarMailtoLink(item, dias), '_blank');
        mostrarToast('📧 Se abrió tu cliente de email (backend no disponible)', 'warning');
    }
}

/**
 * Muestra un toast/notificación temporal
 */
function mostrarToast(mensaje, tipo = 'info') {
    // Remover toast anterior si existe
    const existing = document.querySelector('.toast-notification');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = `toast-notification toast-${tipo}`;
    toast.innerHTML = `
        <span>${mensaje}</span>
        <button onclick="this.parentElement.remove()" style="background:none;border:none;color:inherit;cursor:pointer;font-size:1.2rem;margin-left:1rem;">✕</button>
    `;
    document.body.appendChild(toast);

    // Auto-remover después de 4 segundos
    setTimeout(() => toast.remove(), 4000);
}

/**
 * Obtiene todas las alertas activas (eventos futuros) ordenadas por urgencia
 * Incluye TPs, Parciales y Recuperatorios
 */
function obtenerAlertasActivas(maxDias = 60) {
    return fechasData
        .map(item => {
            // Para parciales con rango, usar la fecha de fin del rango
            const fechaRef = item.fechaFin || item.fecha;
            const dias = diasHasta(fechaRef);
            return { ...item, dias, fechaRef };
        })
        .filter(item => item.dias > 0 && item.dias <= maxDias)
        .sort((a, b) => a.dias - b.dias);
}

/**
 * Renderiza las notificaciones en la sección de Inicio (versión compacta)
 */
function renderizarNotificacionesInicio() {
    const container = document.getElementById('notificationsList');
    if (!container) return;

    const alertas = obtenerAlertasActivas(30).slice(0, 5);

    if (alertas.length === 0) {
        container.innerHTML = '<p style="color: var(--text-secondary);">No hay entregas próximas en los próximos 30 días 🎉</p>';
        return;
    }

    container.innerHTML = alertas.map(item => {
        const nivel = getNivelUrgencia(item.dias);
        const emoji = getEmojiUrgencia(nivel);
        const icono = getIconoTipo(item.tipo);
        return `
            <div class="notification-item alert-${nivel}">
                <span class="notification-icon">${emoji}</span>
                <div class="notification-text">
                    <strong>${item.materia} - ${item.nombre}</strong>
                    <span class="alert-badge alert-badge-${item.tipo.toLowerCase()}">${icono} ${item.tipo}</span>
                    <div class="notification-date">
                        Faltan <strong>${item.dias}</strong> día${item.dias !== 1 ? 's' : ''} — ${formatearFechaAlerta(item)}
                    </div>
                </div>
                <div class="notification-actions">
                    <a href="${generarMailtoLink(item, item.dias)}" class="btn-share btn-email" title="Compartir por Email">📧</a>
                </div>
            </div>
        `;
    }).join('');
}

/**
 * Renderiza la solapa completa de Alertas
 */
function renderizarSolapaAlertas() {
    const container = document.getElementById('alertasContent');
    if (!container) return;

    const alertas = obtenerAlertasActivas(90);
    const filtroActivo = document.getElementById('filtroTipo')?.value || 'todos';
    const filtroMateria = document.getElementById('filtroMateria')?.value || 'todas';

    const alertasFiltradas = alertas.filter(item => {
        if (filtroActivo !== 'todos' && item.tipo.toLowerCase() !== filtroActivo) return false;
        if (filtroMateria !== 'todas' && item.materia !== filtroMateria) return false;
        return true;
    });

    if (alertasFiltradas.length === 0) {
        container.innerHTML = `
            <div style="text-align:center; padding:3rem; color: var(--text-secondary);">
                <p style="font-size:3rem;">🎉</p>
                <p style="font-size:1.2rem;">No hay alertas que coincidan con los filtros</p>
            </div>
        `;
        return;
    }

    // Estadísticas
    const rojas = alertasFiltradas.filter(a => getNivelUrgencia(a.dias) === 'rojo').length;
    const amarillas = alertasFiltradas.filter(a => getNivelUrgencia(a.dias) === 'amarillo').length;
    const verdes = alertasFiltradas.filter(a => getNivelUrgencia(a.dias) === 'verde').length;

    let html = `
        <div class="alertas-stats">
            <div class="stat-card stat-rojo">
                <span class="stat-num">${rojas}</span>
                <span class="stat-label">🔴 Urgentes (≤7 días)</span>
            </div>
            <div class="stat-card stat-amarillo">
                <span class="stat-num">${amarillas}</span>
                <span class="stat-label">🟡 Próximas (8-15 días)</span>
            </div>
            <div class="stat-card stat-verde">
                <span class="stat-num">${verdes}</span>
                <span class="stat-label">🟢 A tiempo (>15 días)</span>
            </div>
        </div>
    `;

    html += `<div class="alertas-list">`;
    html += alertasFiltradas.map(item => {
        const nivel = getNivelUrgencia(item.dias);
        const emoji = getEmojiUrgencia(nivel);
        const icono = getIconoTipo(item.tipo);

        return `
            <div class="alerta-card alert-${nivel}">
                <div class="alerta-semaforo">
                    <span class="semaforo-dot semaforo-${nivel}">${emoji}</span>
                    <span class="alerta-dias">${item.dias}</span>
                    <span class="alerta-dias-label">día${item.dias !== 1 ? 's' : ''}</span>
                </div>
                <div class="alerta-info">
                    <div class="alerta-titulo">
                        ${icono} <strong>${item.materia}</strong> — ${item.nombre}
                    </div>
                    <div class="alerta-meta">
                        <span class="alert-badge alert-badge-${item.tipo.toLowerCase()}">${item.tipo}</span>
                        <span class="alerta-fecha">📅 ${formatearFechaAlerta(item)}</span>
                        <span class="alerta-semestre">Semestre ${item.semestre}</span>
                    </div>
                </div>
                <div class="alerta-acciones">
                    <button class="btn-share btn-email-full" onclick="mostrarModalEmail(${JSON.stringify(item).replace(/"/g, '&quot;')}, ${item.dias})" title="Enviar por Email">
                        📧 Email
                    </button>
                    <a href="${generarMailtoLink(item, item.dias)}" class="btn-share btn-mailto" title="Abrir cliente de email">
                        ✉️ mailto
                    </a>
                </div>
            </div>
        `;
    }).join('');
    html += `</div>`;

    container.innerHTML = html;
}

/**
 * Muestra modal para enviar email de alerta
 */
function mostrarModalEmail(item, dias) {
    const modal = document.getElementById('emailModal');
    if (!modal) return;

    document.getElementById('emailModalMateria').textContent = `${item.materia} - ${item.nombre}`;
    document.getElementById('emailModalFecha').textContent = formatearFechaAlerta(item);
    document.getElementById('emailModalDias').textContent = `${dias} día${dias !== 1 ? 's' : ''}`;
    document.getElementById('emailDestinatario').value = '';

    // Guardar datos del item para el envío
    modal.dataset.item = JSON.stringify(item);
    modal.dataset.dias = dias;

    modal.classList.add('active');
}

/**
 * Cierra el modal de email
 */
function cerrarModalEmail() {
    const modal = document.getElementById('emailModal');
    if (modal) modal.classList.remove('active');
}

/**
 * Confirma el envío de email desde el modal
 */
async function confirmarEnvioEmail() {
    const modal = document.getElementById('emailModal');
    const email = document.getElementById('emailDestinatario').value;

    if (!email || !email.includes('@')) {
        mostrarToast('❌ Ingresá un email válido', 'error');
        return;
    }

    const item = JSON.parse(modal.dataset.item);
    const dias = parseInt(modal.dataset.dias);

    cerrarModalEmail();
    await enviarAlertaEmail(item, dias, email);
}

/**
 * Inicializa los filtros de la solapa Alertas
 */
function inicializarFiltrosAlertas() {
    // Obtener materias únicas
    const materias = [...new Set(fechasData.map(f => f.materia))].sort();

    const selectMateria = document.getElementById('filtroMateria');
    if (selectMateria) {
        selectMateria.innerHTML = '<option value="todas">Todas las materias</option>';
        materias.forEach(m => {
            selectMateria.innerHTML += `<option value="${m}">${m}</option>`;
        });
    }
}
