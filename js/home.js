// new Vue({
//     el: 'header',
//     data: {
//         showNotifications: false
//     }
// })

var table = document.getElementById('party_table').getElementsByTagName('tbody').item(0);

function insertParty(obj) {
    /*Namens Zeile*/
    row = document.createElement('tr');
    cellName = document.createElement('td');
    //Tag für Namens Feld setzen
    row.setAttribute('tag', 'name');
    //Zellenbreite einstellen
    cellName.setAttribute('colspan', 2);
    //Namen einfügen
    cellName.innerHTML = obj.name;
    row.appendChild(cellName);
    //Zeile anhängen
    //table.appendChild(row);

    /*Daten Zeile*/
    row = document.createElement('tr');
    row.setAttribute('tag', 'party');
    cellImg = document.createElement('td');
    cellInfo = document.createElement('td');
    cellDesc = document.createElement('td');
    //Tag für Bild Feld setzen
    cellImg.setAttribute('tag', 'image');
    if (obj.image) //wenn bild vorhanden, einfügen
        cellImg.innerHTML = '<img src='+obj.image+' alt=\"Papla icon\">';
    else //sonst standard Bild
        cellImg.innerHTML = '<img src=\"img/logo.png\" alt=\"Papla icon\">';
    //Tag für Info Feld setzen
    cellInfo.setAttribute('tag', 'info');
    //Infos einfügen
    cellInfo.innerHTML = 'Wer?: ' + obj.user + '<br>Wo?: ' + obj.location + '<br>Wann?: ' + obj.time;
    //Tag für Beschreibungs Feld setzen
    cellDesc.setAttribute('tag', 'desc');
    //Beschreibung einfügen
    cellDesc.innerHTML = obj.description;
    //Zellen Einfügen
    row.appendChild(cellImg);
    row.appendChild(cellInfo);
    row.appendChild(cellDesc);
    //Zeile Anhängen
    table.appendChild(row);

    //Spacer Anhängen
    table.appendChild(makeSpacer())
}

function makeSpacer() {
    row = document.createElement('tr');
    row.setAttribute('tag', 'spacer');
    return row;
}

if(false)
for (i = 0; i < 100; i++) {

    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4 && xhr.responseText) {
            obj = JSON.parse(xhr.responseText);
            if (!obj.error) {
                console.log("Appending to table! " + xhr.responseText);
                insertParty(obj)
            }
        }
    });
    xhr.open("GET", "http://api.dleunig.de/parties/" + i);
    xhr.setRequestHeader("content-type", "application/json");
    xhr.send();
}
