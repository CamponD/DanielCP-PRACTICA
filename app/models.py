from app import db

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(25), nullable=False, unique=True)
    email = db.Column(db.String(50), nullable=False, unique=True)
    password = db.Column(db.String(200), nullable=False)

    collaborators = db.relationship('Collaborator', back_populates='user')

    def __repr__(self):
        return f'<User {self.username}>'
    
    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email
        }

class Project(db.Model):
    __tablename__ = 'projects'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)

    collaborators = db.relationship('Collaborator', back_populates='project')
    tasks = db.relationship('Task', back_populates='project', cascade="all, delete-orphan")

    def __repr__(self):
        return f'<Project {self.name}>'
    
    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name
        }

class Collaborator(db.Model):
    __tablename__ = 'collaborators'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'))
    role = db.Column(db.String(25), nullable=False, default='member')

    user = db.relationship('User', back_populates='collaborators')
    project = db.relationship('Project', back_populates='collaborators')

    def __repr__(self):
        return f'<Collaborator User:{self.user_id} Project:{self.project_id} Role:{self.role}>'
    
    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "project_id": self.project_id,
            "role": self.role
        }

class Task(db.Model):
    __tablename__ = 'tasks'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(255))
    status = db.Column(db.String(20), nullable=False, default='pending')
    deadline = db.Column(db.Date)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'), nullable=False)

    project = db.relationship('Project', back_populates='tasks')

    def __repr__(self):
        return f"<Task {self.title} (Status: {self.status})>"
    
    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "status": self.status,
            "deadline": self.deadline.isoformat() if self.deadline else None,
            "project_id": self.project_id
        }