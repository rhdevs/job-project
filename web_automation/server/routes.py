from flask import Blueprint, jsonify, request
from autofill_handler import AutofillHandler

main = Blueprint('main', __name__)

@main.route('/')
def hello():
    """
    This function is a test function to check if the server is running

    Returns:
    str: The string "Hello, World!"
    """

    return 'Hello, World!'

@main.route('/api/generate-autofill-data', methods=['POST'])
def generate_autofill_data():
    """
    This is the main function to get the autofill data by providing the application form of the current website

    Returns:
    autofill_data (dict): The field selector (key) with the corresponding value (value)
    status_code (int): The status code of the request
    """

    print("generate autofill data")
    data = request.get_json()
    url = data['url']
    try:
        autofill_data = AutofillHandler.generate_autofill_data(url)
        
        return autofill_data, 200
    except:
        return "Error retrieving autofill_data", 400
