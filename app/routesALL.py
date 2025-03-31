from flask import Blueprint, jsonify, request
from app import db
from app.models import User, Project, Collaborator, Task
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import jwt_required, get_jwt_identity, create_access_token
from datetime import datetime

main = Blueprint('main', __name__)

@main.route("/")
def home():
    return "¡Bienvenido a la aplicación de gestión de tareas!"

#---------------------------Users--------------------------

@main.route('/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    # Validar datos
    if not username or not email or not password:
        return jsonify({"error": "Missing username, email, or password"}), 400

    # Verificar si el usuario o correo ya existe
    if User.query.filter_by(username=username).first():
        return jsonify({"error": "Username already exists"}), 400
    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email already exists"}), 400

    # Crear el nuevo usuario
    hashed_password = generate_password_hash(password)
    new_user = User(username=username, email=email, password=hashed_password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User registered successfully"}), 201

@main.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    # Validar datos
    if not username or not password:
        return jsonify({"error": "Missing username or password"}), 400

    # Verificar el usuario
    user = User.query.filter_by(username=username).first()
    if not user or not check_password_hash(user.password, password):
        return jsonify({"error": "Invalid credentials"}), 401

    # Generar el token JWT
    access_token = create_access_token(identity=str(user.id))
    return jsonify(access_token=access_token), 200

@main.route('/user', methods=['GET'])
@jwt_required()
def get_user():
    # Obtener el ID del usuario autenticado desde el token
    current_user_id = get_jwt_identity()

    # Buscar al usuario en la base de datos
    user = User.query.get(current_user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    # Devolver los datos del usuario
    return jsonify({
        "id": user.id,
        "username": user.username,
        "email": user.email
    }), 200


@main.route('/users/search', methods=['GET'])
def search_user_by_username():
    username = request.args.get('username')  # Obtiene el parámetro 'username'
    if not username:
        return jsonify({"error": "Missing 'username' parameter"}), 400
    user = User.query.filter_by(username=username).first()
    if not user:
        return jsonify({"error": "User not found"}), 404
    return jsonify({"id": user.id, "username": user.username, "email": user.email})

#--------------------------Projects--------------------------

@main.route('/projects', methods=['GET'])
def get_projects():
    # Simulación del usuario autenticado
    authenticated_user_id = 1  # Cambiar por lógica real de autenticación
    projects = Project.query.join(Collaborator).filter(Collaborator.user_id == authenticated_user_id).all()
    return jsonify([{'id': p.id, 'name': p.name} for p in projects])

@main.route('/projects', methods=['POST'])
def create_project():
    data = request.json

    if not data.get('name'):
        return jsonify({"error": "Missing 'name' field"}), 400
    # Simulación del usuario autenticado
    authenticated_user_id = 1  # Cambiar por lógica real de autenticación

    new_project = Project(name=data['name'])
    db.session.add(new_project)
    db.session.commit()

    # Asociar al usuario autenticado como colaborador propietario
    collaborator = Collaborator(user_id=authenticated_user_id, project_id=new_project.id, role='owner')
    db.session.add(collaborator)
    db.session.commit()

    # Responder con el proyecto creado
    return jsonify({'id': new_project.id, 'name': new_project.name}), 201

@main.route('/projects/<int:project_id>', methods=['DELETE'])
def delete_project(project_id):
    # Simulación del usuario autenticado
    authenticated_user_id = 1  # Cambiar por lógica real de autenticación

    project = Project.query.get(project_id)
    if not project:
        return jsonify({"error": "Project not found"}), 404

    # Verificar si el usuario tiene permisos para eliminar el proyecto
    collaborator = Collaborator.query.filter_by(project_id=project_id, user_id=authenticated_user_id, role='owner').first()
    if not collaborator:
        return jsonify({"error": "You do not have permission to delete this project"}), 403

    # Eliminar el proyecto y todos los colaboradores asociados
    Collaborator.query.filter_by(project_id=project_id).delete()  # Elimina las asociaciones de colaboradores
    db.session.delete(project)  # Elimina el proyecto
    db.session.commit()  # Guarda los cambios

    return jsonify({"message": "Project deleted successfully"}), 200

#--------------------------Collaborators--------------------------

@main.route('/projects/<int:project_id>/collaborators', methods=['GET'])
def get_project_collaborators(project_id):
    # Simulación del usuario autenticado
    authenticated_user_id = 1  # Cambiar por lógica de autenticación real

    # Verificar que el proyecto existe
    project = Project.query.get(project_id)
    if not project:
        return jsonify({"error": "Project not found"}), 404

    # Verificar si el usuario autenticado tiene acceso al proyecto
    collaborator = Collaborator.query.filter_by(project_id=project_id, user_id=authenticated_user_id).first()
    if not collaborator:
        return jsonify({"error": "You do not have access to this project"}), 403

    # Obtener la lista de colaboradores
    collaborators = Collaborator.query.filter_by(project_id=project_id).all()
    response = [
        {"id": c.user.id, "username": c.user.username, "role": c.role}
        for c in collaborators
    ]

    return jsonify(response), 200

@main.route('/projects/<int:project_id>/collaborators', methods=['POST'])
def add_project_collaborator(project_id):
    data = request.json  # Obtener datos del cuerpo de la solicitud
    user_to_add_id = data.get('user_id')  # ID del usuario a agregar
    role = data.get('role', 'member')  # Rol del nuevo colaborador (predeterminado: 'member')

    # Simulación del usuario autenticado
    authenticated_user_id = 1  # Cambiar por lógica real de autenticación

    # Verificar que el proyecto existe
    project = Project.query.get(project_id)
    if not project:
        return jsonify({"error": "Project not found"}), 404

    # Verificar si el usuario autenticado tiene permisos para agregar colaboradores
    collaborator = Collaborator.query.filter_by(project_id=project_id, user_id=authenticated_user_id, role='owner').first()
    if not collaborator:
        return jsonify({"error": "You do not have permission to add collaborators"}), 403

    # Verificar que el usuario a agregar existe
    user_to_add = User.query.get(user_to_add_id)
    if not user_to_add:
        return jsonify({"error": "User not found"}), 404

    # Verificar si el usuario ya es colaborador del proyecto
    existing_collaborator = Collaborator.query.filter_by(project_id=project_id, user_id=user_to_add_id).first()
    if existing_collaborator:
        return jsonify({"error": "User is already a collaborator"}), 400

    # Agregar al usuario como colaborador
    new_collaborator = Collaborator(user_id=user_to_add_id, project_id=project_id, role=role)
    db.session.add(new_collaborator)
    db.session.commit()

    return jsonify({
        "message": "Collaborator added successfully",
        "project_id": project_id,
        "collaborator": {
            "id": user_to_add.id,
            "username": user_to_add.username,
            "role": role
        }
    }), 201

@main.route('/projects/<int:project_id>/collaborators/<int:user_id>', methods=['DELETE'])
def remove_project_collaborator(project_id, user_id):
    # Simulación del usuario autenticado
    authenticated_user_id = 1  # Cambiar por lógica real de autenticación

    # Verificar que el proyecto existe
    project = Project.query.get(project_id)
    if not project:
        return jsonify({"error": "Project not found"}), 404

    # Verificar si el usuario autenticado tiene permisos para eliminar colaboradores
    owner = Collaborator.query.filter_by(project_id=project_id, user_id=authenticated_user_id, role='owner').first()
    if not owner:
        return jsonify({"error": "You do not have permission to remove collaborators"}), 403

    # Verificar si el usuario a eliminar es colaborador del proyecto
    collaborator = Collaborator.query.filter_by(project_id=project_id, user_id=user_id).first()
    if not collaborator:
        return jsonify({"error": "Collaborator not found"}), 404

    # No permitir que el propietario se elimine a sí mismo
    if collaborator.role == 'owner':
        return jsonify({"error": "Cannot remove the owner of the project"}), 403

    # Eliminar al colaborador
    db.session.delete(collaborator)
    db.session.commit()

    return jsonify({"message": "Collaborator removed successfully"}), 200

#--------------------------Tasks--------------------------

@main.route('/projects/<int:project_id>/tasks', methods=['GET'])
def list_tasks(project_id):
    # Simulación del usuario autenticado
    authenticated_user_id = 1  # Cambiar por lógica real de autenticación

    # Verificar que el proyecto existe
    project = Project.query.get(project_id)
    if not project:
        return jsonify({"error": "Project not found"}), 404

    # Verificar si el usuario autenticado es colaborador del proyecto
    collaborator = Collaborator.query.filter_by(project_id=project_id, user_id=authenticated_user_id).first()
    if not collaborator:
        return jsonify({"error": "You do not have access to this project"}), 403

    # Obtener todas las tareas del proyecto
    tasks = Task.query.filter_by(project_id=project_id).all()
    response = [
        {
            "id": task.id,
            "title": task.title,
            "description": task.description,
            "status": task.status,
            "deadline": task.deadline
        }
        for task in tasks
    ]

    return jsonify(response), 200

@main.route('/projects/<int:project_id>/tasks', methods=['POST'])
def create_task(project_id):
    data = request.json  # Datos enviados por el cliente

    # Validar datos
    title = data.get('title')
    description = data.get('description')
    deadline_str = data.get('deadline')  # Fecha en formato string
    deadline = datetime.strptime(deadline_str, '%Y-%m-%d').date() if deadline_str else None
    if not title:
        return jsonify({"error": "Missing 'title' field"}), 400

    # Simulación del usuario autenticado
    authenticated_user_id = 1  # Cambiar por lógica real de autenticación

    # Verificar que el proyecto existe
    project = Project.query.get(project_id)
    if not project:
        return jsonify({"error": "Project not found"}), 404

    # Verificar si el usuario autenticado es colaborador del proyecto
    collaborator = Collaborator.query.filter_by(project_id=project_id, user_id=authenticated_user_id).first()
    if not collaborator:
        return jsonify({"error": "You do not have access to this project"}), 403

    # Crear la nueva tarea
    new_task = Task(
        title=title,
        description=description,
        deadline=deadline,
        project_id=project_id
    )
    db.session.add(new_task)
    db.session.commit()

    return jsonify({
        "message": "Task created successfully",
        "task": {
            "id": new_task.id,
            "title": new_task.title,
            "description": new_task.description,
            "status": new_task.status,
            "deadline": new_task.deadline
        }
    }), 201

@main.route('/projects/<int:project_id>/tasks/<int:task_id>', methods=['PUT'])
def update_task(project_id, task_id):
    data = request.json  # Datos enviados por el cliente

    # Simulación del usuario autenticado
    authenticated_user_id = 1  # Cambiar por lógica real de autenticación

    # Verificar que el proyecto existe
    project = Project.query.get(project_id)
    if not project:
        return jsonify({"error": "Project not found"}), 404

    # Verificar si el usuario autenticado es colaborador del proyecto
    collaborator = Collaborator.query.filter_by(project_id=project_id, user_id=authenticated_user_id).first()
    if not collaborator:
        return jsonify({"error": "You do not have access to this project"}), 403

    # Verificar que la tarea existe y pertenece al proyecto
    task = Task.query.filter_by(id=task_id, project_id=project_id).first()
    if not task:
        return jsonify({"error": "Task not found"}), 404

    # Actualizar los campos proporcionados
    if 'title' in data:
        task.title = data['title']
    if 'description' in data:
        task.description = data['description']
    if 'status' in data:
        if data['status'] not in ['pending', 'in_progress', 'completed']:
            return jsonify({"error": "Invalid status"}), 400
        task.status = data['status']
    if 'deadline' in data:
        try:
            task.deadline = datetime.strptime(data['deadline'], '%Y-%m-%d').date()
        except ValueError:
            return jsonify({"error": "Invalid date format. Use YYYY-MM-DD"}), 400

    # Guardar los cambios
    db.session.commit()

    return jsonify({
        "message": "Task updated successfully",
        "task": {
            "id": task.id,
            "title": task.title,
            "description": task.description,
            "status": task.status,
            "deadline": task.deadline
        }
    }), 200

@main.route('/projects/<int:project_id>/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(project_id, task_id):
    # Simulación del usuario autenticado
    authenticated_user_id = 1  # Cambiar por lógica real de autenticación

    # Verificar que el proyecto existe
    project = Project.query.get(project_id)
    if not project:
        return jsonify({"error": "Project not found"}), 404

    # Verificar si el usuario autenticado es colaborador del proyecto
    collaborator = Collaborator.query.filter_by(project_id=project_id, user_id=authenticated_user_id).first()
    if not collaborator:
        return jsonify({"error": "You do not have access to this project"}), 403

    # Verificar que la tarea existe y pertenece al proyecto
    task = Task.query.filter_by(id=task_id, project_id=project_id).first()
    if not task:
        return jsonify({"error": "Task not found"}), 404

    # Eliminar la tarea
    db.session.delete(task)
    db.session.commit()

    return jsonify({"message": "Task deleted successfully"}), 200

