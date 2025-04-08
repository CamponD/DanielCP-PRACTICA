from flask import Blueprint, request, jsonify
from app import db
from app.models import User
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import jwt_required, get_jwt_identity, create_access_token

auth = Blueprint("auth", __name__)

@auth.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    # Validar datos
    if not username or not email or not password:
        return jsonify({"msg": "Todos los campos son obligatorios"}), 400

    if User.query.filter_by(username=username).first():
        return jsonify({"msg": "Ese nombre de usuario ya está en uso"}), 409

    if User.query.filter_by(email=email).first():
        return jsonify({"msg": "Ese email ya está registrado"}), 409

    # Encriptar password
    hashed_pw = generate_password_hash(password)
    new_user = User(username=username, email=email, password=hashed_pw)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"msg": "Usuario registrado correctamente"}), 201


@auth.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    # Validar datos
    if not username or not password:
        return jsonify({"error": "Todos los campos son obligatorios"}), 400

    # Verificar el usuario
    user = User.query.filter_by(username=username).first()
    if not user or not check_password_hash(user.password, password):
        return jsonify({"msg": "Credenciales inválidas"}), 401

    # Generar el token JWT
    access_token = create_access_token(identity=str(user.id))
    return jsonify({"access_token": access_token, "username": user.username}), 200