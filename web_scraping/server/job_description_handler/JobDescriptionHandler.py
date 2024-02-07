from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.edge.service import Service
from selenium.webdriver.edge.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

import os
import openai
import time
from flask import jsonify

# Openai setup
OPENAI_PROMPT = """
                Here are texts on a job application page, 
                please find out the important job descriptions 
                (i.e. the role, the responsibilities, the requirements, etc.) from the texts.
                Do not include irrelevant information from the website such as privacy policy
                """
OPENAI_KEY = os.getenv("OPENAI_KEY1")
openai.api_key = OPENAI_KEY

# Selenium setup
current_dir = os.path.dirname(__file__)
DRIVER_PATH = os.path.join(current_dir, "msedgedriver.exe")
webdriver_service = Service(DRIVER_PATH)
webdriver_options = Options()
webdriver_options.add_argument("--headless")

# Variables to be finetuned
JOB_DESC_COMMON_WORDS = ["create", "develop", "manage", "participate", "handle", "control", "help", "prepare", "respond", "report"]
WORD_MIN = 10
WORD_MAX = 30

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


def get_job_description(url):
    """
    This function gets the job description from a job application page

    Parameters:
    url (str): The URL of the job application page

    Returns:
    job_descriptions (str): The job descriptions
    """

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
    
    # Getting all texts in page
    try:
        allStrings = driver.find_element(By.XPATH, "/html/body").text.split('\n')
        debug_write(debug_out, f"Page body:\n{allStrings}")

    except Exception as e:
        error = "Error getting texts from page: " + str(e)
        debug_write(debug_out, error)
        return error

    # filteredStrings = []
    debug_write(debug_out, f"Website texts:\n{allStrings}")

    # Getting openai response
    try:
        response = openai.Completion.create(
            engine="gpt-3.5-turbo-instruct",
            prompt=OPENAI_PROMPT + "\n".join(allStrings),
            max_tokens=2000,
            n=1,
            stop=None,
            temperature=0.7,
            top_p=1.0,
            frequency_penalty=0.0,
            presence_penalty=0.0
        )
        debug_write(debug_out, f"Response choices:\n{response.choices}")
        job_descriptions = response.choices[0].text.strip() 

    except Exception as e:
        error = "Error getting openai response: " + str(e)
        debug_write(debug_out, error)
        return error
    
    # def checkIfStringHasCommonWord(str):
    #     if str.find("is a") != -1:  # obviously not a description
    #         return False

    #     for commonWords in JOB_DESC_COMMON_WORDS:
    #         if commonWords in str.lower().split():
    #             return True
    #     return False


    # for string in allStrings:
    #     strLength = len(string.split())
    #     if WORD_MIN < strLength < WORD_MAX:
    #         if checkIfStringHasCommonWord(string):
    #             filteredStrings.append(string)
    # for string in filteredStrings:
    #     print(string)
    # for string in filteredStrings:
    #     job_descriptions += string + "\n"
        
    driver.close()
    return job_descriptions
    