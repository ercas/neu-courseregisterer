// crns variable was injected by run() in popup.js
console.log(crns);

var entered = 0;

// paste crns into the text fields
for (var i = 0; i < crns.length; i++) {
    try {
        document.getElementById("crn_id" + (i + 1)).value = crns[i];
        entered++
    } catch(err) {
        console.log("element with id crn_id" + (i + 1) + " does not exist");
    }
}

if (entered == 0) {
    alert("ERROR: No CRN input fields found"
          + "\n\nMake sure you're running this from the add/drop classes page."
          + "\n\nIf you are and think this is a bug, submit an issue:"
          + "\nhttps://github.com/ercas/neu-courseregisterer/issues")
} else {
    // find and press the submit button
    window.setTimeout(function() {
        var buttons = document.getElementsByName("REG_BTN");
        for (var i = 0; i < buttons.length; i++) {
            if (buttons[i].value == "Submit Changes") {
                buttons[i].click();
            }
        }
    }, 500)
}
