const URL_BASE = "http://api.dleunig.de/";

function getRequest(url, listener) {
    var xhr = new XMLHttpRequest();

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4 && this.responseText) {
            obj = JSON.parse(this.responseText);
            listener(obj);
        }
    });
    xhr.open("GET", URL_BASE+url);
    xhr.setRequestHeader("content-type", "application/json");
    xhr.send();
}

function postRequest(url, data, listener) {
    var xhr = new XMLHttpRequest();

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4 && this.responseText) {
            obj = JSON.parse(this.responseText);
            listener(obj);
        }
    });
    xhr.open("POST", URL_BASE+url);
    xhr.setRequestHeader("content-type", "application/json");
    xhr.send(data);
}

function putRequest(url, data, listener) {
    var xhr = new XMLHttpRequest();

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4 && this.responseText) {
            obj = JSON.parse(this.responseText);
            listener(obj);
        }
    });
    xhr.open("PUT", URL_BASE+url);
    xhr.setRequestHeader("content-type", "application/json");
    xhr.send(data);
}

function deleteRequest(url, data, listener) {
    var xhr = new XMLHttpRequest();

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4 && this.responseText) {
            obj = JSON.parse(this.responseText);
            listener(obj);
        }
    });
    xhr.open("DELETE", URL_BASE+url);
    xhr.setRequestHeader("content-type", "application/json");
    xhr.send(data);
}
