document.addEventListener('DOMContentLoaded', function() {
    var btnClick = document.getElementById('btnClick');

    btnClick.addEventListener('click', function() {
        // Step 1: Read the JSON file
        fetch('personal_info.json')
            .then(response => response.json())
            .then(data => {
                // Step 2: Identify input fields using OpenAI API
                identifyInputFields()
                    .then(fields => {
                        // Step 3: Fill the identified input fields with personal data
                        fillInputFields(data, fields);
                    })
                    .catch(error => {
                        console.error('Error identifying input fields:', error);
                    });
            })
            .catch(error => {
                console.error('Error reading JSON file:', error);
            });
    });
});

function identifyInputFields() {
    const url = "https://api.openai.com/v1/chat/completions";
    const apiKey = "";
    const bearer = `Bearer ${apiKey}`;
    
   // Get the HTML content of the current webpage
   const pageContent = document.documentElement.outerHTML;
   console.log('Page content:', pageContent)

    const data = {
        "model": "gpt-3.5-turbo",
        "messages": [{"role": "user", "content": "Identify input fields on the webpage: " + pageContent}],
        "temperature": 0.7
    };
    
    return fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': bearer,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch chat completions from GPT-3');
        }
        return response.json();
    })
    .then(result => {
        // Parse the response from the OpenAI API and extract the identified input fields
        console.log('Identified input fields:', result);
        const identifiedFields = parseResponse(result);
        return identifiedFields;
    })
    .catch(error => {
        console.error('Error identifying input fields:', error);
        return [];
    });
}

function parseResponse(result) {
    // Parse the response from the OpenAI API and extract the identified input fields
    // Example implementation:
    const completions = result.data;
    if (!completions || completions.length === 0) {
        console.error('No completions found in the response.');
        return [];
    }
    const identifiedFields = completions.map(completion => {
        if (completion.text) {
            return completion.text.trim();
        } else {
            console.error('No text found in a completion.');
            return '';
        }
    });
    return identifiedFields;
}

function fillInputFields(data, fields) {
    // Loop through the identified input fields
    fields.forEach(field => {
        // Find the corresponding personal data based on the field name
        let fieldValue;
        switch (field) {
            case 'firstNameInput':
                fieldValue = data.firstName;
                break;
            case 'lastNameInput':
                fieldValue = data.lastName;
                break;
            case 'emailInput':
                fieldValue = data.email;
                break;
            case 'phoneInput':
                fieldValue = data.phoneNumber;
                break;
            // Add more cases for other input fields as needed
            default:
                fieldValue = ''; // Default value if no matching field is found
                break;
        }

        // Fill the identified input field with the corresponding personal data
        const inputField = document.getElementById(field);
        if (inputField) {
            inputField.value = fieldValue;
        } else {
            console.error(`Input field '${field}' not found.`);
        }
    });
}
