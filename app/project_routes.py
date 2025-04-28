from flask import Blueprint, jsonify, request
from app import db
from app.models import User, Project, Collaborator, Task
from flask_jwt_extended import jwt_required, get_jwt_identity, create_access_token

project_bp = Blueprint('project_bp', __name__)

# Obtener proyectos del usuario logeado
@project_bp.route('/projects', methods=['GET'])
@jwt_required()
def get_user_projects():
    user_id = int(get_jwt_identity())
    projects = db.session.query(Project, Collaborator.role).join(Collaborator).filter(Collaborator.user_id == user_id).all()

    results = [
        {**project.to_dict(), "role": role}
        for project, role in projects
    ]
    return jsonify(results), 200


# Crear nuevo proyecto
@project_bp.route('/projects/new', methods=['POST'])
@jwt_required()
def create_project():
    user_id = int(get_jwt_identity())
    data = request.get_json()
    name = data.get("name")
    description = data.get("description")

    if not name:
        return jsonify({"error": "El nombre del proyecto es obligatorio"}), 400
    
    existing = Project.query.filter_by(name=name).first()
    if existing:
        return jsonify({"error": "Ese proyecto ya existe."}), 409
    
    # Crear el proyecto
    project = Project(name=name, description=description)
    db.session.add(project)
    db.session.commit()

    # Agregar al usuario como owner
    owner = Collaborator(user_id=user_id, project_id=project.id, role='owner')
    db.session.add(owner)
    db.session.commit()

    return jsonify({
        "message": "Proyecto creado con éxito",
        "project": {**project.to_dict(), "role": "owner"}
    }), 201


# Eliminar proyecto
@project_bp.route('/projects/<int:project_id>', methods=['DELETE'])
@jwt_required()
def delete_project(project_id):
    user_id = int(get_jwt_identity())

    # Buscar si el usuario es owner del proyecto
    owner = Collaborator.query.filter_by(
        user_id=user_id, project_id=project_id, role='owner'
    ).first()

    if not owner:
        return jsonify({"error": "No tienes permiso para eliminar este proyecto"}), 403
    
    project = Project.query.get(project_id)

    if not project:
        return jsonify({"error": "Proyecto no encontrado"}), 404

    try:
        db.session.delete(project)
        db.session.commit()
        return jsonify({"msg": "Proyecto eliminado"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Error al eliminar proyecto"}), 500