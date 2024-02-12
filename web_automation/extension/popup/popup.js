console.log('popup.js loaded');
document.addEventListener('DOMContentLoaded', function () {
    console.log('DOMContentLoaded');
    document.getElementById('processButton').addEventListener('click', function () {
        console.log('processButton clicked');
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            console.log('chrome tabs being queried');
            var activeTab = tabs[0];
            fillInputFields(activeTab);
        });
    });

    function fillInputFields(tab) {
        console.log('Filling input fields for url: ', tab);
        
        // Get autofill data from the server
        fetch('http://127.0.0.1:5000/api/generate-autofill-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                url: tab.url
            }), 
        })
        .then(response => response.json()) // Parse JSON response
        .then(autofillData => {
            console.log('Autofill Data:', autofillData);
            
            // Convert autofillData to a JavaScript map
            let autofillDataMap = new Map(Object.entries(autofillData));

            console.log('Autofill Data Map:', autofillDataMap);
            
            // // Define a map to store input fields and their corresponding values
            // let autofillDataMap = new Map();
    
            // // Add examples to the map
            // autofillDataMap.set('input[data-test="nameInput"]', "Text for first input");
            // autofillDataMap.set('input.atsx-phone-input', "Text for second input");
    
            // Function to fill input fields based on the map
            autofillDataMap.forEach((value, key) => {
                console.log("Adressing field with value:", key, value);
                chrome.scripting.executeScript({
                    target: { tabId: tab.id },
                    func: (key, value) => {
                        const inputField = document.querySelector(key);
                        if (inputField) {
                            inputField.value = value;
                        } else {
                            console.error(`Input field '${key}' not found.`);
                        }
                    },
                    args: [key, value]
                });
            });
        })
        .catch(error => console.error('Error:', error));
    }
});
