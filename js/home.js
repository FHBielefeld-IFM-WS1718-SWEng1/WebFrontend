new Vue({
    el: '#start',
    data: {
        showNotifications: false
    }
})

var table = document.getElementById('party_table').getElementsByTagName('tbody').item(0);

function makeRow(obj) {
    row = document.createElement("tr");
    cellImg = document.createElement("td");
    cellInfo = document.createElement("td");
    cellDesc = document.createElement("td");
    cellImg.appendChild(document.createTextNode("[image]"));
    cellInfo.innerHTML = "Wer?: " + obj.name + "<br>Wo?: " + obj.homeworld + "<br>Wann?: " + obj.birth_year;
    cellDesc.innerHTML = obj.description;
    row.appendChild(cellImg);
    row.appendChild(cellInfo);
    row.appendChild(cellDesc);
    return row;
}

function makeSpacer() {
    row = document.createElement("tr");
    row.setAttribute("tag", "spacer");
    return row;
}

for (i = 0; i < 100; i++) {

    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4 && xhr.responseText) {
            obj = JSON.parse(xhr.responseText);
            if (!obj.error) {
                console.log("Appending to table! " + xhr.responseText);
                table.appendChild(makeRow(obj));
                table.appendChild(makeSpacer());
            }
        }
    });
    xhr.open("GET", "http://api.dleunig.de/parties/" + i);
    xhr.setRequestHeader("content-type", "application/json");
    xhr.send();
}
