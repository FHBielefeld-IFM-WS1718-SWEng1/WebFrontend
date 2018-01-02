const contentVue = new Vue({
    el: '#content',
    data: {
        email: "",
        name: "",
        birthdate: "",
        gender: 0,
        owner: false,
        popup_delete: false
    },
    methods: {
        updateProfile() {
            var json = JSON.stringify({
                "name": this.name,
                "birthdate": this.birthdate,
                "gender": parseInt(this.gender)
            });
            putRequest("user/" + userId + "?api=" + apiKey, json, function (data) {
            });
        },
        confirmDelete() {
            popupVue.showPopup('delete')
        },
        deleteProfile() {
            deleteRequest("user/" + userId + "?api=" + apiKey, function (data) {
                if (data.message === "erfolg") {
                    papla_logout(apiKey);
                }
            });
        },
        getLocalizedGender() {
            return this.gender === 1 ? "Männlich" : this.gender === 2 ? "Weiblich" : this.gender === 3 ? "Andere" : "Keine Angabe";
        }
    }
});

var loggedInId = localStorage.getItem("userId");
var split = /(id=)(\d+)/g.exec(window.location.href);
var userId = (split != null && split.length > 0) ? split[2] : loggedInId;
var apiKey = localStorage.getItem("apiKey");
contentVue.owner = userId === loggedInId;
getRequest("user/" + userId + "?api=" + apiKey, function (data) {
    if (!data.error) {
        contentVue.email = data.email;
        contentVue.name = data.name;
        contentVue.birthdate = data.birthdate;
        contentVue.gender = data.gender;
    }
});

/*
 * Popups Initialisieren
 */
const popupVue = new PopupHandler('.popup-container',
    {'delete': false},
    {'delete': contentVue.deleteProfile});

var eventsPast = document.getElementById('list_events_past');
var eventsFuture = document.getElementById('list_events_future');

function insertParty(obj) {
    var time = new Date(obj.startDate);
    /*Tabellen auswahl, je nach dem ob das event vor oder nach jetzt ist */
    var table = time < new Date() ? eventsPast : eventsFuture;

    /*Namens Zeile*/
    entry = document.createElement('li');

    entry.innerHTML = '<a href=\"party.html?id='+obj.id+'\">'+obj.name+'<\a>';
    //Zeile anhängen
    table.appendChild(entry);
}

getRequest("party?api=" + apiKey, function (data) {
    if (!data.error && data.parties) {
        for (var i in data.parties)
            insertParty(data.parties[i]);
    }
});