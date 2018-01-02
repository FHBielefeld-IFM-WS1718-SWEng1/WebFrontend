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
    table.appendChild(row);

    /*Daten Zeile*/
    row = document.createElement('tr');
    row.setAttribute('tag', 'party');
    cellImg = document.createElement('td');
    cellInfo = document.createElement('td');
    cellDesc = document.createElement('td');
    //Tag für Bild Feld setzen
    cellImg.setAttribute('tag', 'image');
    if (obj.image) //wenn bild vorhanden, einfügen
        cellImg.innerHTML = '<img src=\"data:image/jpeg;base64,' + obj.image + '\" alt="img/logo.png">';
    else //sonst standard Bild
        cellImg.innerHTML = '<img src=\"img/logo.png\" alt=\"Papla icon\">';

    cellInfo.setAttribute('tag', 'info');
    //Infos einfügen

    var options = {weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'};
    var time = new Date(obj.startDate);
    cellInfo.innerHTML = 'Wer?: ' + obj.user + '<br>Wo?: ' + obj.location + '<br>Wann?: ' + time.toLocaleDateString('de-DE', options);
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


var apiKey = localStorage.getItem("apiKey");
console.log("API Key: " + apiKey);
getRequest("party?api=" + apiKey, function (data) {
    if (!data.error && data.parties) {
        for (var i in data.parties)
            insertParty(data.parties[i]);
    }
});


new Vue({
    el: '#navi',
    data: {},
    methods: {
        logout() {
            papla_logout(apiKey);
        }
    }
})