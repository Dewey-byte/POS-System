from flask import jsonify

def success(data=None, message="Success"):
    return jsonify({"message": message, "data": data}), 200

def error(message="Error", status=400):
    return jsonify({"message": message}), status
