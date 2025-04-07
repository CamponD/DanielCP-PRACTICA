from flask import Blueprint, jsonify, request
from app import db
from app.models import User, Project, Collaborator, Task
from flask_jwt_extended import jwt_required, get_jwt_identity, create_access_token

dashboard = Blueprint("dashboard", __name__)

@dashboard.route("/dashboard", methods=["Get"])
@jwt_required()
def get_dashboard():
    # Obtener el ID del usuario autenticado desde el token
    user_id = int(get_jwt_identity())

    # Buscar al usuario en la base de datos
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "Usuario no encontrado"}), 404

    # Devolver los datos del usuario
    return jsonify({
        "id": user.id,
        "username": user.username,
        "email": user.email
    }), 200