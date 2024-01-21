console.log("testing 1 2 3")

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if (request.action === "autofill") {
        // Modify this part to fit the structure of the web page you are working with
        console.log("filling")
        var forms = document.querySelectorAll('form');
        forms.forEach(function(form) {
          form.querySelector('input[name="email"]').value = 'you@example.com';
        });
      }
    }
  );
  