"""
main.py - Backend FastAPI para Liceninfo
=========================================
Endpoints:
    - POST /api/alerts/email   → Enviar alerta por email (SMTP)
    - POST /api/careers/parse  → Parsear plan de estudios con Gemini AI
    - POST /api/careers        → Guardar carrera
    - GET  /api/careers        → Listar carreras guardadas
    - GET  /api/careers/{id}   → Obtener carrera por ID
    - DELETE /api/careers/{id} → Eliminar carrera
    - GET  /api/health         → Health check
"""

import os
import json
import uuid
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from pathlib import Path
from typing import Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel, EmailStr
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()

# ============================================
# Configuración
# ============================================
SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER", "")
SMTP_PASS = os.getenv("SMTP_PASS", "")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")

# Directorio para guardar datos de carreras
DATA_DIR = Path(__file__).parent / "data"
DATA_DIR.mkdir(exist_ok=True)
CAREERS_FILE = DATA_DIR / "careers.json"

# ============================================
# App FastAPI
# ============================================
app = FastAPI(
    title="Liceninfo API",
    description="Backend para el Portal Estudiantil de Lic. en Informática",
    version="1.0.0"
)

# CORS - permite requests del frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================
# Modelos Pydantic
# ============================================
class EmailAlertRequest(BaseModel):
    to_email: str
    subject: str
    materia: str
    tipo: str
    nombre: str
    fecha: str
    dias_restantes: int


class CareerParseRequest(BaseModel):
    nombre: str
    texto_plan: str


class CareerData(BaseModel):
    nombre: str
    plan: list = []
    duracion: Optional[str] = None
    total_materias: Optional[int] = None


# ============================================
# Utilidades
# ============================================
def load_careers() -> list:
    """Carga las carreras guardadas del archivo JSON"""
    if CAREERS_FILE.exists():
        try:
            return json.loads(CAREERS_FILE.read_text(encoding="utf-8"))
        except (json.JSONDecodeError, IOError):
            return []
    return []


def save_careers(careers: list):
    """Guarda las carreras en el archivo JSON"""
    CAREERS_FILE.write_text(
        json.dumps(careers, ensure_ascii=False, indent=2),
        encoding="utf-8"
    )


# ============================================
# Endpoints
# ============================================

@app.get("/api/health")
async def health():
    """Health check del servidor"""
    return {
        "status": "ok",
        "service": "Liceninfo API",
        "smtp_configured": bool(SMTP_USER),
        "gemini_configured": bool(GEMINI_API_KEY)
    }


@app.post("/api/alerts/email")
async def send_email_alert(req: EmailAlertRequest):
    """
    Envía una alerta por email usando SMTP.
    Requiere configurar SMTP_USER y SMTP_PASS en .env
    """
    if not SMTP_USER or not SMTP_PASS:
        raise HTTPException(
            status_code=503,
            detail="El servidor de email no está configurado. Configurá SMTP_USER y SMTP_PASS en el .env"
        )

    try:
        # Construir el email
        msg = MIMEMultipart("alternative")
        msg["Subject"] = req.subject
        msg["From"] = SMTP_USER
        msg["To"] = req.to_email

        # Determinar color del semáforo
        if req.dias_restantes <= 7:
            color = "#ef4444"
            urgencia = "🔴 URGENTE"
        elif req.dias_restantes <= 15:
            color = "#f59e0b"
            urgencia = "🟡 PRÓXIMAMENTE"
        else:
            color = "#10b981"
            urgencia = "🟢 A TIEMPO"

        # Versión texto plano
        text_content = f"""
{urgencia}

📚 Materia: {req.materia}
📋 Evento: {req.tipo} - {req.nombre}
📅 Fecha: {req.fecha}
⏳ Faltan: {req.dias_restantes} día(s)

🎓 Portal Estudiantil - Lic. en Informática - Siglo 21
        """.strip()

        # Versión HTML (más bonita)
        html_content = f"""
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 500px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #06b6d4 0%, #10b981 100%); color: white; padding: 20px; border-radius: 12px 12px 0 0; text-align: center;">
                <h2 style="margin: 0;">🎓 Portal Estudiantil</h2>
                <p style="margin: 5px 0 0; opacity: 0.9;">Lic. en Informática - Siglo 21</p>
            </div>
            <div style="background: #f8fafc; padding: 24px; border: 1px solid #e2e8f0; border-top: none;">
                <div style="background: white; border-left: 5px solid {color}; padding: 16px; border-radius: 8px; margin-bottom: 16px;">
                    <p style="margin: 0 0 4px; font-size: 14px; color: {color}; font-weight: bold;">{urgencia}</p>
                    <h3 style="margin: 0; color: #1e293b;">{req.materia} — {req.nombre}</h3>
                </div>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr><td style="padding: 8px 0; color: #64748b;">📋 Tipo</td><td style="padding: 8px 0; font-weight: bold;">{req.tipo}</td></tr>
                    <tr><td style="padding: 8px 0; color: #64748b;">📅 Fecha</td><td style="padding: 8px 0; font-weight: bold;">{req.fecha}</td></tr>
                    <tr><td style="padding: 8px 0; color: #64748b;">⏳ Faltan</td><td style="padding: 8px 0; font-weight: bold; color: {color};">{req.dias_restantes} día(s)</td></tr>
                </table>
            </div>
            <div style="text-align: center; padding: 12px; color: #94a3b8; font-size: 12px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 12px 12px;">
                Enviado desde Liceninfo — Portal Estudiantil
            </div>
        </div>
        """

        msg.attach(MIMEText(text_content, "plain"))
        msg.attach(MIMEText(html_content, "html"))

        # Enviar con SMTP
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_USER, SMTP_PASS)
            server.send_message(msg)

        return {"status": "sent", "to": req.to_email}

    except smtplib.SMTPAuthenticationError:
        raise HTTPException(
            status_code=401,
            detail="Error de autenticación SMTP. Verificá tu App Password de Gmail."
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error al enviar email: {str(e)}"
        )


@app.post("/api/careers/parse")
async def parse_career_plan(req: CareerParseRequest):
    """
    Usa Gemini AI para parsear un plan de estudios en texto libre
    y devolver una estructura JSON organizada por cuatrimestres.
    """
    if not GEMINI_API_KEY:
        raise HTTPException(
            status_code=503,
            detail="La API key de Gemini no está configurada. Agregala en GEMINI_API_KEY en el .env"
        )

    try:
        from google import genai

        # Crear cliente de Gemini
        client = genai.Client(api_key=GEMINI_API_KEY)

        # Prompt diseñado para extraer info estructurada
        prompt = f"""Analiza el siguiente plan de estudios universitario y extrae la información estructurada.

NOMBRE DE LA CARRERA: {req.nombre}

TEXTO DEL PLAN:
{req.texto_plan}

Responde ÚNICAMENTE con un JSON válido (sin explicaciones ni markdown) con esta estructura exacta:
{{
    "nombre": "nombre de la carrera",
    "duracion": "X años" o "X cuatrimestres",
    "total_materias": número_total,
    "plan": [
        {{
            "cuatrimestre": 1,
            "nombre": "Cuatrimestre 1",
            "materias": [
                {{
                    "nombre": "Nombre de la materia",
                    "tipo": "regular" | "electiva" | "proceso" | "universitario",
                    "correlativas": "Materia X, Materia Y" (o null si no hay)
                }}
            ]
        }}
    ]
}}

Reglas:
- Si no puedes determinar el cuatrimestre exacto, agrúpalas por año (2 cuatrimestres por año)
- El tipo por defecto es "regular"
- Si una materia dice "electiva" o es optativa, tipo = "electiva"
- Si dice "taller" o "práctica", tipo = "proceso"
- Devuelve SOLO el JSON, sin comillas de bloque de código
"""

        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=prompt
        )

        # Parsear respuesta JSON
        response_text = response.text.strip()

        # Limpiar posibles marcadores de código
        if response_text.startswith("```"):
            lines = response_text.split("\n")
            response_text = "\n".join(lines[1:-1])

        result = json.loads(response_text)
        return result

    except ImportError:
        raise HTTPException(
            status_code=503,
            detail="El paquete 'google-genai' no está instalado. Ejecutá: pip install google-genai"
        )
    except json.JSONDecodeError as e:
        raise HTTPException(
            status_code=500,
            detail=f"Gemini devolvió una respuesta que no es JSON válido. Intentá de nuevo. Error: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error al procesar con Gemini: {str(e)}"
        )


@app.post("/api/careers")
async def save_career(career: dict):
    """Guarda una carrera parseada en el servidor"""
    careers = load_careers()

    # Verificar si ya existe y actualizar
    existing_idx = next(
        (i for i, c in enumerate(careers) if c.get("nombre") == career.get("nombre")),
        None
    )
    if existing_idx is not None:
        careers[existing_idx] = career
    else:
        careers.append(career)

    save_careers(careers)
    return {"status": "saved", "total": len(careers)}


@app.get("/api/careers")
async def list_careers():
    """Lista todas las carreras guardadas"""
    return load_careers()


@app.get("/api/careers/{career_id}")
async def get_career(career_id: int):
    """Obtiene una carrera por su índice"""
    careers = load_careers()
    if career_id < 0 or career_id >= len(careers):
        raise HTTPException(status_code=404, detail="Carrera no encontrada")
    return careers[career_id]


@app.delete("/api/careers/{career_id}")
async def delete_career(career_id: int):
    """Elimina una carrera por su índice"""
    careers = load_careers()
    if career_id < 0 or career_id >= len(careers):
        raise HTTPException(status_code=404, detail="Carrera no encontrada")
    deleted = careers.pop(career_id)
    save_careers(careers)
    return {"status": "deleted", "nombre": deleted.get("nombre")}


# ============================================
# Servir frontend estático
# ============================================
# Montar archivos estáticos del frontend
frontend_path = Path(__file__).parent.parent / "frontend"
if frontend_path.exists():
    app.mount("/css", StaticFiles(directory=str(frontend_path / "css")), name="css")
    app.mount("/js", StaticFiles(directory=str(frontend_path / "js")), name="js")
    if (frontend_path / "assets").exists():
        app.mount("/assets", StaticFiles(directory=str(frontend_path / "assets")), name="assets")

    @app.get("/")
    async def serve_frontend():
        """Sirve el frontend"""
        return FileResponse(str(frontend_path / "index.html"))
else:
    @app.get("/")
    async def serve_info():
        return {"message": "Liceninfo API está corriendo. El frontend no se encontró en ../frontend/"}


# ============================================
# Punto de entrada
# ============================================
if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", "8000"))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
