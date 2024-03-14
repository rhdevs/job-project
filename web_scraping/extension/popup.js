console.log('popup.js loaded');
document.addEventListener('DOMContentLoaded', function () {
    console.log('DOMContentLoaded');
    document.getElementById('processButton').addEventListener('click', function () {
        console.log('processButton clicked');
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            console.log('chrome tabs being queried');
            var activeTab = tabs[0];
            processHTML(activeTab);
        });
    });

    // getting the job description from server
    function processHTML(tab) {
        console.log('HTML being processed')
        fetch('http://127.0.0.1:5000/api/test', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                url: tab.url
            }), 
        })
        .then(response => response.text())
        .then(jobDescription => {
            console.log('Job Description:', jobDescription);
            alert(jobDescription);
        })
        .catch(error => console.error('Error:', error));
    }
});
