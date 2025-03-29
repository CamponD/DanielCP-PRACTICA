# 🛠️ Plataforma de Proyectos Colaborativos

Este proyecto es una plataforma web que permite a los usuarios registrarse, iniciar sesión, crear proyectos, invitar colaboradores y gestionar tareas, todo desde un entorno moderno construido con **React** y **Flask**.

---

## 🚀 Tecnologías utilizadas

### 🔙 Backend
- Python 3
- Flask
- SQLAlchemy (ORM)
- Flask-JWT-Extended (autenticación con JWT)
- python-dotenv (variables de entorno)
- SQLite (base de datos por defecto)

### 🔜 Frontend
- React
- Create React App
- React Router DOM (en fases futuras)
- Fetch / JWT para comunicación con el backend

---

## ⚙️ Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/CamponD/DanielCP-PRACTICA.git
cd DanielCP-PRACTICA
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