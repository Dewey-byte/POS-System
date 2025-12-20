from flask import Blueprint, request, jsonify

sales_bp = Blueprint('sales_bp', __name__)

@sales_bp.route('/sales', methods=['POST'])
def create_sale():
    return jsonify({
        "message": "Sales route is working"
    }), 201
