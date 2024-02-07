// currently redundant
// console.log("content.js loaded");
// chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
//     console.log("Listener");
//     if (request.action === "getHTML") {
//         console.log("getHTML");
//         var html = document.documentElement.innerHTML;
//         sendResponse({ html: html });
//     }
    // else if (request.action === "changeFirstName") {
    //     console.log("changeFirstName");
    //     var firstName = document.getElementById("firstName");

    //     var focusEvent = new FocusEvent("focus", {
    //         bubbles: true,
    //         cancelable: false,
    //         view: window
    //     });
        
    //     var inputEvent = new InputEvent('input', {
    //         bubbles: true,
    //         cancelable: false,
    //         view: window,
    //         data: 'gabriel'
    //     });

    //     var changeEvent = new Event("change", {
    //         bubbles: true,
    //         cancelable: false,
    //         view: window
    //     });

    //     firstName.dispatchEvent(focusEvent);
    //     firstName.value = "gabriel";
    //     firstName.dispatchEvent(inputEvent);
    //     firstName.dispatchEvent(changeEvent);
        
    // }
// });