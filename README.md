# 🎓 Liceninfo — Portal Estudiantil

Portal web para estudiantes de la **Licenciatura en Informática** de la Universidad Siglo 21.

## ✨ Funcionalidades

- 📅 **Calendario Académico** — Fechas de TPs y parciales por modalidad (MIP, MEC, MIA)
- 🔔 **Sistema de Alertas** — Semáforo visual (🔴🟡🟢) según urgencia + envío de alertas por email
- 📚 **Plan de Estudios** — 12 cuatrimestres de la carrera con tipos de materias
- 🤖 **Otras Carreras (IA)** — Procesá planes de cualquier carrera con Gemini AI
- 🔍 **Buscador** — Busca por materia, TP, parcial o fecha
- 🌙 **Modo oscuro/claro** — Preferencia guardada

## 📁 Estructura del Proyecto

```
Liceninfo/
├── frontend/
│   ├── index.html          # Página principal
│   ├── css/
│   │   └── styles.css      # Estilos (semáforo, responsive, dark mode)
│   └── js/
│       ├── data.js          # Datos del calendario y plan
│       ├── alerts.js        # Sistema de alertas
│       ├── app.js           # Navegación, búsqueda, rendering
│       └── gemini.js        # Integración con Gemini AI
├── backend/
│   ├── main.py              # Servidor FastAPI
│   ├── requirements.txt     # Dependencias Python
│   ├── .env.example         # Variables de entorno (template)
│   └── data/                # Carreras guardadas (auto-generado)
├── render.yaml              # Config de deploy en Render.com
└── README.md
```

## 🚀 Setup Local

### 1. Frontend (sin backend)

Abrí `frontend/index.html` directamente en el navegador. Las alertas, calendario, plan y buscador funcionan sin backend.

### 2. Backend (para emails y Gemini AI)

```bash
# Instalar Python 3.10+
cd backend

# Instalar dependencias
pip install -r requirements.txt

# Configurar variables de entorno
copy .env.example .env
# Editá .env con tus datos (Gmail App Password, Gemini API key)

# Ejecutar servidor
python main.py
```

El servidor inicia en `http://localhost:8000`

### Obtener API Keys

#### Gmail App Password (para emails)
1. Ir a [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
2. Generar una contraseña de aplicación para "Correo"
3. Copiar la contraseña en `SMTP_PASS` del `.env`

#### Gemini API Key (para IA)
1. Ir a [aistudio.google.com/apikey](https://aistudio.google.com/apikey)
2. Crear una API key (es gratis)
3. Copiar la key en `GEMINI_API_KEY` del `.env`

## ☁️ Deploy en Render.com

1. Subí el proyecto a GitHub
2. En [Render.com](https://render.com), creá un nuevo **Web Service**
3. Conectá tu repo de GitHub
4. Render detectará el `render.yaml` automáticamente
5. Configurá las variables de entorno (SMTP y Gemini) en el dashboard
6. ¡Deploy automático!

## 🛠 Stack Tecnológico

| Componente | Tecnología |
|-----------|------------|
| Frontend  | HTML, CSS, JavaScript vanilla |
| Backend   | Python, FastAPI |
| IA        | Google Gemini 2.0 Flash |
| Email     | SMTP (Gmail) |
| Deploy    | Render.com (free tier) |

## 📝 Licencia

Proyecto académico de uso libre para la comunidad estudiantil.

---
💻 Desarrollado con ❤️ para la comunidad de Lic. en Informática — Siglo 21
