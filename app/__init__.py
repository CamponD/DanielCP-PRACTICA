from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv
import os
from flask_cors import CORS

# Cargar variables de entorno
load_dotenv()

# Inicializar extensiones
db = SQLAlchemy()
jwt = JWTManager()

def create_app():
    app = Flask(__name__)

    CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

    # Configuración
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///database.db')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['DEBUG'] = os.getenv('DEBUG', 'False') == 'True'

    # Inicializar extensiones con la app
    db.init_app(app)
    jwt.init_app(app)

    # Importar modelos y rutas
    from app import models
    #from app.routes import main
    #app.register_blueprint(main)
    from app.auth_routes import auth
    app.register_blueprint(auth)
    from app.dashboard import dashboard
    app.register_blueprint(dashboard)
    from app.project_routes import project_bp
    app.register_blueprint(project_bp)

    return app