from flask import Blueprint, jsonify, request
from job_description_handler import JobDescriptionHandler

main = Blueprint('main', __name__)

@main.route('/')
def hello():
    """
    This function is a test function to check if the server is running

    Returns:
    str: The string "Hello, World!"
    """

    return 'Hello, World!'

@main.route('/api/test', methods=['POST'])
def get_job_description():
    """
    This is the main function to get the job description from a job application page

    Returns:
    job_description (str): The job description
    status_code (int): The status code of the request
    """

    print("getting job description")
    data = request.get_json()
    url = data['url']
    try:
        job_description = JobDescriptionHandler.get_job_description(url)
        
        return job_description, 200
    except:
        return "Error retrieving job description", 400
