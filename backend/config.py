import os

class Config:
    SQLALCHEMY_DATABASE_URI = "mysql+pymysql://root:@localhost/pos_system"
    SQLALCHEMY_TRACK_MODIFICATIONS = False