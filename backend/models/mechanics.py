from extensions import db   # ✅ better than from app import db

class Mechanic(db.Model):
    __tablename__ = "mechanics"

    id = db.Column(db.Integer, primary_key=True)

    name = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(20))
    email = db.Column(db.String(100))

    specialization = db.Column(db.String(100))
    experience = db.Column(db.Integer, default=0)

    status = db.Column(db.String(20), default="available")  # available | busy | off-duty

    current_jobs = db.Column(db.Integer, default=0)
    completed_jobs = db.Column(db.Integer, default=0)

    

    # ✅ ADD THIS (important)
    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "phone": self.phone,
            "email": self.email,
            "specialization": self.specialization,
            "experience": self.experience,
            "status": self.status,
            "current_jobs": self.current_jobs,
            "completed_jobs": self.completed_jobs,
           
        }