var inputs = document.getElementsByTagName("input");

// validate a crn
function validate(crn) {
    if (crn.match(/^\d\d\d\d\d$/)) {
        return true;
    }
    return false
}

// retrieve all entered crns
function getCrns() {
    var crns = [];
    for (var i = 0; i < inputs.length; i++) {
        var crn = inputs[i].value;
        inputs[i].removeAttribute("style");
        if (validate(crn)) {
            crns.push(crn);
            inputs[i].setAttribute("style", "background: #90ee90;");
        } else if (crn.length > 0) {
            inputs[i].setAttribute("style", "background: #ffb6c1;");
        }
    }
    return crns;
}

// save crns to local storage
function save() {
    var crns = getCrns();
    if (crns.length > 0) {
        chrome.storage.local.set({"crns": crns}, function() {
            console.log("saved crns: " + crns);
        });
    }
}

// load crns from local storage
function load() {
    chrome.storage.local.get("crns", function(savedCrns) {
        if (savedCrns.crns) {
            var crns = savedCrns.crns;
            for (var i = 0; i < crns.length; i++) {
                inputs[i].value = crns[i];
            }
        }
        for (var input of inputs) {
            input.addEventListener("input", function() {
                console.log("new crn: " + input.value);
                save();
            });
        }
        getCrns();
    });
}

// inject crns variable into document and the code that uses it
function run() {
    // very ugly
    chrome.tabs.executeScript({code: "var crns = [" + getCrns() + "]"});
    chrome.tabs.executeScript({file: "input.js"});
}

document.addEventListener("DOMContentLoaded", function() {
    load();
    document.getElementById("main").addEventListener("click", run);
})
