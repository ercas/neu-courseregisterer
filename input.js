// crns variable was injected by run() in popup.js

// paste crns into the text fields
for (var i = 0; i < crns.length; i++) {
    document.getElementById("crn_id" + (i + 1)).value = crns[i];
}

// find and press the button
window.setTimeout(function() {
    var buttons = document.getElementsByName("REG_BTN");
    for (var i = 0; i < buttons.length; i++) {
        if (buttons[i].value == "Submit Changes") {
            buttons[i].click();
        }
    }
}, 500)
