// ============================================
// data.js - Base de datos de fechas académicas
// Liceninfo - Portal Estudiantil
// ============================================

// Todas las fechas de TPs y exámenes del año académico 2026
const fechasData = [
    // ==========================================
    // PRIMER SEMESTRE
    // ==========================================

    // MIP - Cuatrimestral (Primer Semestre)
    { materia: 'MIP', tipo: 'TP', nombre: 'TP1', fecha: '13/04/2026', semestre: 1 },
    { materia: 'MIP', tipo: 'TP', nombre: 'TP2', fecha: '11/05/2026', semestre: 1 },
    { materia: 'MIP', tipo: 'TP', nombre: 'TP3', fecha: '01/06/2026', semestre: 1 },
    { materia: 'MIP', tipo: 'TP', nombre: 'TP4', fecha: '29/06/2026', semestre: 1 },
    { materia: 'MIP', tipo: 'Parcial', nombre: '1er Parcial', fecha: '16/03/2026', fechaFin: '09/05/2026', semestre: 1 },
    { materia: 'MIP', tipo: 'Parcial', nombre: '2do Parcial', fecha: '18/05/2026', fechaFin: '11/07/2026', semestre: 1 },
    { materia: 'MIP', tipo: 'Recuperatorio', nombre: 'Recuperatorio', fecha: '13/07/2026', fechaFin: '18/07/2026', semestre: 1 },

    // MEC 1A - Bimestral
    { materia: 'MEC 1A', tipo: 'TP', nombre: 'TP1 y TP2', fecha: '13/04/2026', semestre: 1 },
    { materia: 'MEC 1A', tipo: 'TP', nombre: 'TP3 y TP4', fecha: '04/05/2026', semestre: 1 },
    { materia: 'MEC 1A', tipo: 'Parcial', nombre: '1er Parcial', fecha: '16/03/2026', fechaFin: '11/04/2026', semestre: 1 },
    { materia: 'MEC 1A', tipo: 'Parcial', nombre: '2do Parcial', fecha: '13/04/2026', fechaFin: '09/05/2026', semestre: 1 },
    { materia: 'MEC 1A', tipo: 'Recuperatorio', nombre: 'Recuperatorio', fecha: '11/05/2026', fechaFin: '16/05/2026', semestre: 1 },

    // MIA 1A - Bimestral
    { materia: 'MIA 1A', tipo: 'TP', nombre: 'TP1', fecha: '06/04/2026', semestre: 1 },
    { materia: 'MIA 1A', tipo: 'TP', nombre: 'TP2', fecha: '13/04/2026', semestre: 1 },
    { materia: 'MIA 1A', tipo: 'TP', nombre: 'TP3', fecha: '27/04/2026', semestre: 1 },
    { materia: 'MIA 1A', tipo: 'TP', nombre: 'TP4', fecha: '04/05/2026', semestre: 1 },
    { materia: 'MIA 1A', tipo: 'Parcial', nombre: '1er Parcial', fecha: '16/03/2026', fechaFin: '11/04/2026', semestre: 1 },
    { materia: 'MIA 1A', tipo: 'Parcial', nombre: '2do Parcial', fecha: '13/04/2026', fechaFin: '09/05/2026', semestre: 1 },
    { materia: 'MIA 1A', tipo: 'Recuperatorio', nombre: 'Recuperatorio', fecha: '11/05/2026', fechaFin: '16/05/2026', semestre: 1 },

    // MEC 1B - Bimestral
    { materia: 'MEC 1B', tipo: 'TP', nombre: 'TP1 y TP2', fecha: '15/06/2026', semestre: 1 },
    { materia: 'MEC 1B', tipo: 'TP', nombre: 'TP3 y TP4', fecha: '06/07/2026', semestre: 1 },
    { materia: 'MEC 1B', tipo: 'Parcial', nombre: '1er Parcial', fecha: '18/05/2026', fechaFin: '13/06/2026', semestre: 1 },
    { materia: 'MEC 1B', tipo: 'Parcial', nombre: '2do Parcial', fecha: '15/06/2026', fechaFin: '11/07/2026', semestre: 1 },
    { materia: 'MEC 1B', tipo: 'Recuperatorio', nombre: 'Recuperatorio', fecha: '13/07/2026', fechaFin: '18/07/2026', semestre: 1 },

    // MIA 1B - Bimestral
    { materia: 'MIA 1B', tipo: 'TP', nombre: 'TP1', fecha: '08/06/2026', semestre: 1 },
    { materia: 'MIA 1B', tipo: 'TP', nombre: 'TP2', fecha: '15/06/2026', semestre: 1 },
    { materia: 'MIA 1B', tipo: 'TP', nombre: 'TP3', fecha: '29/06/2026', semestre: 1 },
    { materia: 'MIA 1B', tipo: 'TP', nombre: 'TP4', fecha: '06/07/2026', semestre: 1 },
    { materia: 'MIA 1B', tipo: 'Parcial', nombre: '1er Parcial', fecha: '18/05/2026', fechaFin: '13/06/2026', semestre: 1 },
    { materia: 'MIA 1B', tipo: 'Parcial', nombre: '2do Parcial', fecha: '15/06/2026', fechaFin: '11/07/2026', semestre: 1 },
    { materia: 'MIA 1B', tipo: 'Recuperatorio', nombre: 'Recuperatorio', fecha: '13/07/2026', fechaFin: '18/07/2026', semestre: 1 },

    // ==========================================
    // SEGUNDO SEMESTRE
    // ==========================================

    // MIP - Cuatrimestral (Segundo Semestre)
    { materia: 'MIP', tipo: 'TP', nombre: 'TP1', fecha: '31/08/2026', semestre: 2 },
    { materia: 'MIP', tipo: 'TP', nombre: 'TP2', fecha: '28/09/2026', semestre: 2 },
    { materia: 'MIP', tipo: 'TP', nombre: 'TP3', fecha: '19/10/2026', semestre: 2 },
    { materia: 'MIP', tipo: 'TP', nombre: 'TP4', fecha: '16/11/2026', semestre: 2 },
    { materia: 'MIP', tipo: 'Parcial', nombre: '1er Parcial', fecha: '03/08/2026', fechaFin: '26/09/2026', semestre: 2 },
    { materia: 'MIP', tipo: 'Parcial', nombre: '2do Parcial', fecha: '05/10/2026', fechaFin: '28/11/2026', semestre: 2 },
    { materia: 'MIP', tipo: 'Recuperatorio', nombre: 'Recuperatorio', fecha: '30/11/2026', fechaFin: '05/12/2026', semestre: 2 },

    // MEC 2A - Bimestral
    { materia: 'MEC 2A', tipo: 'TP', nombre: 'TP1 y TP2', fecha: '31/08/2026', semestre: 2 },
    { materia: 'MEC 2A', tipo: 'TP', nombre: 'TP3 y TP4', fecha: '21/09/2026', semestre: 2 },
    { materia: 'MEC 2A', tipo: 'Parcial', nombre: '1er Parcial', fecha: '03/08/2026', fechaFin: '29/08/2026', semestre: 2 },
    { materia: 'MEC 2A', tipo: 'Parcial', nombre: '2do Parcial', fecha: '31/08/2026', fechaFin: '26/09/2026', semestre: 2 },
    { materia: 'MEC 2A', tipo: 'Recuperatorio', nombre: 'Recuperatorio', fecha: '28/09/2026', fechaFin: '03/10/2026', semestre: 2 },

    // MIA 2A - Bimestral
    { materia: 'MIA 2A', tipo: 'TP', nombre: 'TP1', fecha: '24/08/2026', semestre: 2 },
    { materia: 'MIA 2A', tipo: 'TP', nombre: 'TP2', fecha: '31/08/2026', semestre: 2 },
    { materia: 'MIA 2A', tipo: 'TP', nombre: 'TP3', fecha: '14/09/2026', semestre: 2 },
    { materia: 'MIA 2A', tipo: 'TP', nombre: 'TP4', fecha: '21/09/2026', semestre: 2 },
    { materia: 'MIA 2A', tipo: 'Parcial', nombre: '1er Parcial', fecha: '03/08/2026', fechaFin: '29/08/2026', semestre: 2 },
    { materia: 'MIA 2A', tipo: 'Parcial', nombre: '2do Parcial', fecha: '31/08/2026', fechaFin: '26/09/2026', semestre: 2 },
    { materia: 'MIA 2A', tipo: 'Recuperatorio', nombre: 'Recuperatorio', fecha: '28/09/2026', fechaFin: '03/10/2026', semestre: 2 },

    // MEC 2B - Bimestral
    { materia: 'MEC 2B', tipo: 'TP', nombre: 'TP1 y TP2', fecha: '02/11/2026', semestre: 2 },
    { materia: 'MEC 2B', tipo: 'TP', nombre: 'TP3 y TP4', fecha: '23/11/2026', semestre: 2 },
    { materia: 'MEC 2B', tipo: 'Parcial', nombre: '1er Parcial', fecha: '05/10/2026', fechaFin: '31/10/2026', semestre: 2 },
    { materia: 'MEC 2B', tipo: 'Parcial', nombre: '2do Parcial', fecha: '02/11/2026', fechaFin: '28/11/2026', semestre: 2 },
    { materia: 'MEC 2B', tipo: 'Recuperatorio', nombre: 'Recuperatorio', fecha: '30/11/2026', fechaFin: '05/12/2026', semestre: 2 },

    // MIA 2B - Bimestral
    { materia: 'MIA 2B', tipo: 'TP', nombre: 'TP1', fecha: '26/10/2026', semestre: 2 },
    { materia: 'MIA 2B', tipo: 'TP', nombre: 'TP2', fecha: '02/11/2026', semestre: 2 },
    { materia: 'MIA 2B', tipo: 'TP', nombre: 'TP3', fecha: '16/11/2026', semestre: 2 },
    { materia: 'MIA 2B', tipo: 'TP', nombre: 'TP4', fecha: '23/11/2026', semestre: 2 },
    { materia: 'MIA 2B', tipo: 'Parcial', nombre: '1er Parcial', fecha: '05/10/2026', fechaFin: '31/10/2026', semestre: 2 },
    { materia: 'MIA 2B', tipo: 'Parcial', nombre: '2do Parcial', fecha: '02/11/2026', fechaFin: '28/11/2026', semestre: 2 },
    { materia: 'MIA 2B', tipo: 'Recuperatorio', nombre: 'Recuperatorio', fecha: '30/11/2026', fechaFin: '05/12/2026', semestre: 2 },
];

// Plan de estudios completo de Licenciatura en Informática
const planEstudios = [
    {
        cuatrimestre: 1,
        materias: [
            { nombre: 'Aprender en el Siglo 21', tipo: 'universitario' },
            { nombre: 'Tecnología, Humanidades y Modelos Globales', tipo: 'universitario' },
            { nombre: 'Idioma Extranjero I', tipo: 'regular' }
        ]
    },
    {
        cuatrimestre: 2,
        materias: [
            { nombre: 'Álgebra y Geometría', tipo: 'regular' },
            { nombre: 'Análisis Matemático', tipo: 'regular' },
            { nombre: 'Lógica Simbólica', tipo: 'regular' },
            { nombre: 'Idioma Extranjero II', tipo: 'regular' }
        ]
    },
    {
        cuatrimestre: 3,
        materias: [
            { nombre: 'Programación Orientada a Objetos', tipo: 'regular' },
            { nombre: 'Arquitectura del Computador', tipo: 'regular' },
            { nombre: 'Matemática Discreta', tipo: 'regular' },
            { nombre: 'Idioma Extranjero III', tipo: 'regular' }
        ]
    },
    {
        cuatrimestre: 4,
        materias: [
            { nombre: 'Cálculo Avanzado', tipo: 'regular' },
            { nombre: 'Algoritmos y Estructuras de Datos I', tipo: 'regular' },
            { nombre: 'Taller de Algoritmos y Estructuras de Datos I', tipo: 'proceso' },
            { nombre: 'Idioma Extranjero IV', tipo: 'regular' }
        ]
    },
    {
        cuatrimestre: 5,
        materias: [
            { nombre: 'Algoritmos y Estructuras de Datos II', tipo: 'regular' },
            { nombre: 'Taller de Algoritmos y Estructuras de Datos II', tipo: 'proceso' },
            { nombre: 'Base de Datos I', tipo: 'regular' },
            { nombre: 'Principios de Economía', tipo: 'regular' },
            { nombre: 'Idioma Extranjero V', tipo: 'regular' }
        ]
    },
    {
        cuatrimestre: 6,
        materias: [
            { nombre: 'Sistemas Operativos', tipo: 'regular' },
            { nombre: 'Estadística y Probabilidad', tipo: 'regular' },
            { nombre: 'Lenguajes Formales y Computabilidad', tipo: 'regular' },
            { nombre: 'Administración, Grupo y Liderazgo', tipo: 'regular' },
            { nombre: 'Idioma Extranjero VI', tipo: 'regular' }
        ]
    },
    {
        cuatrimestre: 7,
        materias: [
            { nombre: 'Análisis y Diseño de Software', tipo: 'regular' },
            { nombre: 'Redes', tipo: 'regular' },
            { nombre: 'Base de Datos II', tipo: 'regular' },
            { nombre: 'Desarrollo Emprendedor', tipo: 'regular' },
            { nombre: 'Electiva I', tipo: 'electiva' }
        ]
    },
    {
        cuatrimestre: 8,
        materias: [
            { nombre: 'Comunicaciones', tipo: 'regular' },
            { nombre: 'Sistemas de Información', tipo: 'regular' },
            { nombre: 'Programación Lógica', tipo: 'regular' },
            { nombre: 'Herramientas Matemáticas VI - Modelos de Simulación', tipo: 'regular' },
            { nombre: 'Electiva II', tipo: 'electiva' }
        ]
    },
    {
        cuatrimestre: 9,
        materias: [
            { nombre: 'Programación Cliente - Servidor', tipo: 'regular' },
            { nombre: 'Desarrollo de Aplicaciones con Bases de Datos', tipo: 'regular' },
            { nombre: 'Inteligencia Artificial', tipo: 'regular' },
            { nombre: 'Auditoría de Sistemas', tipo: 'regular' },
            { nombre: 'Seminario de Práctica de Lic. en Informática', tipo: 'proceso' }
        ]
    },
    {
        cuatrimestre: 10,
        materias: [
            { nombre: 'Sistemas Operativos Avanzados', tipo: 'regular' },
            { nombre: 'Desarrollo Web', tipo: 'regular' },
            { nombre: 'Gestión de Proyectos de Infraestructura', tipo: 'regular' },
            { nombre: 'Calidad de Software', tipo: 'regular' },
            { nombre: 'Ética y Deontología Profesional', tipo: 'regular' },
            { nombre: 'Práctica Solidaria', tipo: 'proceso' }
        ]
    },
    {
        cuatrimestre: 11,
        materias: [
            { nombre: 'Seguridad Informática', tipo: 'regular' },
            { nombre: 'Pruebas de Sistemas', tipo: 'regular' },
            { nombre: 'Ingeniería de Software', tipo: 'regular' },
            { nombre: 'Algoritmos Concurrentes y Paralelos', tipo: 'regular' },
            { nombre: 'Emprendimientos Universitarios', tipo: 'regular' },
            { nombre: 'Práctica Profesional de Lic. en Informática', tipo: 'proceso' }
        ]
    },
    {
        cuatrimestre: 12,
        materias: [
            { nombre: 'Seminario Final de Informática', tipo: 'proceso' }
        ]
    }
];

// Enlaces útiles
const enlacesData = [
    {
        icono: '💬',
        titulo: 'Comunidad WhatsApp',
        descripcion: 'Únete al grupo de la comunidad para estar conectado con tus compañeros',
        url: 'https://chat.whatsapp.com/EATutvsN6OB23m6wwlcvnm',
        boton: 'Unirse al Grupo'
    },
    {
        icono: '📚',
        titulo: 'Canvas',
        descripcion: 'Accede a los módulos de cada materia y entrega tus trabajos prácticos',
        url: 'https://siglo21.instructure.com/',
        boton: 'Ir a Canvas'
    },
    {
        icono: '🎓',
        titulo: 'Portal Web Alumnos',
        descripcion: 'Realiza gestiones administrativas y anótate a materias',
        url: 'https://estudiantes.uesiglo21.edu.ar/es-AR/cursado',
        boton: 'Ir al Portal'
    },
    {
        icono: '📊',
        titulo: 'Simulador de Condición',
        descripcion: 'Simula tu condición para saber si promocionas o debes rendir finales',
        url: 'https://www.lanube.21.edu.ar/simulador-de-condicion',
        boton: 'Usar Simulador'
    }
];
