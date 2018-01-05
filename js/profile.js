const contentVue = new Vue({
    el: '#content',
    data: {
        email: "",
        name: "",
        birthdate: "",
        gender: 0,
        owner: true,
        searchString: "Tim"
    },
    methods: {
        updateProfile() {
            var json = JSON.stringify({
                "name": this.name,
                "birthdate": this.birthdate,
                "gender": parseInt(this.gender)
            });
            putRequest("user/" + userId + "?api=" + apiKey, json, function (data) {
                if (!data.error && data.name)
                    localStorage.setItem("userName", data.name);
                naviVue.refreshName();
            });
        },
        confirmDelete() {
            popupVue.showPopup('delete');
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
        },
        search() {
            console.log('Show popup!');
            popupVue.showPopup('search');
            var searchresults = document.getElementById('searchresults');
            console.log('results: '+searchresults);
            for (var i in userList)
                if (userList[i].name.startsWith(this.searchString)) {
                    console.log('  found:'+userList[i].name);
                    var entry = document.createElement('li');
                    entry.innerHTML = '<a href="profile.html?id=' + i + '">' + userList[i] + '</a>'
                    entry.innerHTML += '<button pos="right" class="confirm" @click="confirm(\'search\'' + i + ')">+</button>'
                    searchresults.appendChild(entry);
                }
            // <li>
            // <button pos="right" class="deny" @click="show['delete'] = false">Nein</button>
            //     </li>
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

function addContact(id) {
    console.log("Add contact: "+id);
}

/*
 * Popups Initialisieren
 */
const popupVue = new PopupHandler('.popup-container',
    {'delete': false, 'search': false},
    {'delete': contentVue.deleteProfile, 'search': addContact});

var userList;

if (contentVue.owner) {
    var eventsPast = document.getElementById('list_events_past');
    var eventsFuture = document.getElementById('list_events_future');

    function insertParty(obj) {
        var time = new Date(obj.endDate ? obj.endDate : obj.startDate);
        /*Tabellen auswahl, je nach dem ob das event vor oder nach jetzt ist */
        var table = time < new Date() ? eventsPast : eventsFuture;

        /*Namens Zeile*/
        entry = document.createElement('li');

        entry.innerHTML = '<a href=\"party.html?id=' + obj.id + '\">' + obj.name + '<\a>';
        //Zeile anhängen
        table.appendChild(entry);
    }

    getRequest("party?api=" + apiKey, function (data) {
        if (!data.error && data.parties) {
            for (var i in data.parties)
                insertParty(data.parties[i]);
        }
    });

    getRequest("user?api=" + apiKey, function (data) {
        if (!data.error && data.values) {
            userList = data.values;
        }
    });
}
