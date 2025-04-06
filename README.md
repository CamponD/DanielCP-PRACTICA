# 🚀 TeamTrack - Plataforma de gestión de tareas y colaboración en equipo
Una app fullstack desarrollada con Flask y React para crear proyectos, invitar colaboradores y gestionar tareas fácilmente.

---

## 🚀 Tecnologías utilizadas

### 🔙 Backend
- Python 3
- Flask
- Flask-SQLAlchemy
- Flask-JWT-Extended
- Python-dotenv
- SQLite

### 🔜 Frontend
- React
- Vite
- Tailwind CSS
- React Router DOM

---

## ⚙️ Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/CamponD/TeamTrack.git
cd TeamTrack
```

### 2. Configurar el entorno del backend

```bash
python -m venv venv
source venv/bin/activate      # Linux/macOS
# o
.\venv\Scripts\activate       # Windows

pip install -r requirements.txt
```

### 3. Crear el archivo `.env` en la raíz del proyecto

```env
JWT_SECRET_KEY=tu_clave_secreta
DATABASE_URL=sqlite:///database.db
DEBUG=True
```

### 4. Ejecutar el backend

```bash
python run.py
```

---

### 5. Configurar y ejecutar el frontend

```bash
cd frontend
npm install
npm start
```

---

## ✨ Características actuales

- Registro e inicio de sesión con JWT
- Contraseñas seguras con hash
- Gestión de usuarios con `username` como identificador
- Rutas organizadas con Blueprints
- Uso de variables de entorno con `.env`
- Arquitectura escalable (estructura modular con `create_app()`)

---

## 📌 Estado del proyecto

🟠 En desarrollo  
📅 Última actualización: **marzo 2025**  
🎯 Sprint actual: **Sistema de autenticación (backend + frontend)**

---

## ✍️ Autor

**Daniel Campón Perdigones**  
GitHub: [@CamponD](https://github.com/CamponD)
