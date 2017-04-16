var inputs = document.getElementsByTagName("input");
var currentOption = 0;
var options = 5;
var allCrns = [];
for (var i = 0; i < options; i++) {
    allCrns[i] = [];
}

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
    allCrns[currentOption] = crns;
    return crns;
}

// save on every input update
function bindInputs() {
    for (var input of inputs) {
        input.addEventListener("input", save);
    }
}

// disable saving on every input update
function unbindInputs() {
    for (var input of inputs) {
        input.removeEventListener("input", save);
    }
}

// save crns to local storage
function save() {
    getCrns();
    chrome.storage.local.set({"crns": allCrns}, function() {
        console.log("saved crns: " + JSON.stringify(allCrns));
    });
}

// load crns from local storage
function load() {
    chrome.storage.local.get("crns", function(savedCrns) {
        if (savedCrns.crns) {
            var crns = savedCrns.crns[currentOption];
            for (var i = 0; i < crns.length; i++) {
                inputs[i].value = crns[i];
            }
        }
        bindInputs();
        getCrns();
    });
}

// inject crns variable into document and the code that uses it
function inject() {
    // very ugly
    chrome.tabs.executeScript({code: "var crns = [" + allCrns[currentOption] + "]"});
    chrome.tabs.executeScript({file: "input.js"});
    window.setTimeout(window.close, 50);
}

// cycle different crn combinations
function cycle(inc) {
    currentOption = (currentOption + inc) % options;
    if (currentOption < 0) {
        currentOption = options - 1;
    }
    document.getElementById("pageNum").innerHTML = "Option "
                                                   + (currentOption + 1)
                                                   + "/" + options;
    unbindInputs();
    for (var input of inputs) {
        input.value = "";
    }
    load();
    getCrns();
}

// clear the current crns
function clear() {
    for (var input of inputs) {
        input.value = "";
    }
    getCrns();
    save();
}

document.addEventListener("DOMContentLoaded", function() {
    load();
    document.getElementById("main").addEventListener("click", inject);
    document.getElementById("prev").addEventListener("click", function() {
        cycle(-1);
    });
    document.getElementById("next").addEventListener("click", function() {
        cycle(1);
    });
    document.getElementById("clear").addEventListener("click", clear);
    document.getElementById("version").addEventListener("click", function() {
        chrome.tabs.executeScript({code: "window.location = \"https://github.com/ercas/neu-courseregisterer\""})
        window.setTimeout(window.close, 50);
    });
})
