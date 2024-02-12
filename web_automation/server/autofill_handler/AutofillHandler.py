from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.edge.service import Service
from selenium.webdriver.edge.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

import os
import time
from flask import jsonify
from openai import OpenAI

# Openai setup
OPENAI_PROMPT = """
                Here are input fields on a job application page and personal information of an applicant.
                Please return a dict with the HTML element as key (addressable by document.querySelector())
                and the corresponding personal information for this field as value.
                Do not return more pairs as there are input fields in the list and make sure they are properly addressable.
                """
client = OpenAI(api_key = "")

# Selenium setup
current_dir = os.path.dirname(__file__)
DRIVER_PATH = os.path.join(current_dir, "msedgedriver.exe")
webdriver_service = Service(DRIVER_PATH)
webdriver_options = Options()
webdriver_options.add_argument("--headless")

# Function to write to debug file
def debug_write(debug_file, text):
    """
    This function writes text to the debug file

    Parameters:
    debug_file (str): The debug file
    text (str): The text to write
    """

    debug_breakline = "\n\n" + 40 * "-" + "\n\n"
    debug_file.write(text + debug_breakline)

def generate_autofill_data(url):
    """
    This function gets the autofill data from a job application page

    Parameters:
    url (str): The URL of the job application page

    Returns:
    autofill_data (dict): The autofill data
    """

    personal_info = open("personal_info.txt", "r", encoding='utf-8').read()

    debug_out = open("debug.txt", "w", encoding='utf-8')

    # Selenium driver setup
    try:
        driver = webdriver.Edge(service=webdriver_service, options=webdriver_options)
        driver.execute_cdp_cmd('Network.setUserAgentOverride', {"userAgent":'Mozilla/5.0 (Windows NT 6.2; rv:20.0) Gecko/20121202 Firefox/20.0'})
        driver.get(url)
        
        # To load entire webpage
        time.sleep(5)

        debug_write(debug_out, f"Succesfully entered URL: {url}")

    except Exception as e:
        debug_write(debug_out, f"Failed to enter URL: {url}\nError: {e}")
        return None
    
    # Getting all input fields in page
    try:
        #TODO: Input fields are not found 
        input_elements = []
        input_elements_raw = driver.find_elements(By.XPATH, "//input")
        for input_element in input_elements_raw:
            input_elements.append(input_element.get_attribute('outerHTML'))
        debug_write(debug_out, f"Page body:\n{input_elements}")
        
    except Exception as e:
        error = "Error getting texts from page: " + str(e)
        debug_write(debug_out, error)
        return None

    # Getting openai response
    try:
        response = client.chat.completions.create(
            messages=[
                {
                    "role": "user",
                    "content": OPENAI_PROMPT + "\n".join(input_elements) + "\n".join(personal_info),
                }
            ],
            model="gpt-3.5-turbo",
        )
        debug_write(debug_out, f"Response choices:\n{response.choices}")
        autofill_data = response.choices[0].message.content
        debug_write(debug_out, f"Autofill data:\n{autofill_data}")
        
    except Exception as e:
        error = "Error getting openai response: " + str(e)
        debug_write(debug_out, error)
        return None
        
    driver.close()
    return autofill_data
