import os

class Config:
    SQLALCHEMY_DATABASE_URI = "mysql+pymysql://root:@localhost/pos_system"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    MAIL_SERVER = "smtp.gmail.com"
    MAIL_PORT = 587
    MAIL_USE_TLS = True
    MAIL_USERNAME = "your_email@gmail.com"
    MAIL_PASSWORD = "your_app_password"
    MAIL_DEFAULT_SENDER = "your_email@gmail.com"