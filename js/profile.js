const contentVue = new Vue({
    el: '#content',
    data: {
        email: "",
        name: "",
        birthdate: "",
        gender: 0,
        owner: true,
        contactList: [],
        searchString: "Tim",
        eventsPast: [],
        eventsFuture: []
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
            popupVue.showPopup('search');
        }
    },
    created: function () {
        let loggedInId = localStorage.getItem("userId");
        let split = /(id=)(\d+)/g.exec(window.location.href);
        let userId = (split != null && split.length > 0) ? split[2] : loggedInId;
        let apiKey = localStorage.getItem("apiKey");

        this.owner = userId === loggedInId;
        //Nutzerdaten abrufen
        getRequest("user/" + userId + "?api=" + apiKey, function (data) {
            if (!data.error) {
                contentVue.email = data.email;
                contentVue.name = data.name;
                contentVue.birthdate = data.birthdate;
                contentVue.gender = data.gender;
            }
        });

        //Kontaktliste abrufen
        if (this.owner)
            getRequest("user/contact?api=" + apiKey, function (data) {
                if (!data.error && data.contacts) {
                    contentVue.contactList = data.contacts;
                }
            });

        //Parties abrufen
        if (this.owner)
            getRequest("party?api=" + apiKey, function (data) {
                if (!data.error && data.parties) {
                    let timeNow = new Date();
                    for (let i in data.parties) {
                        let party = data.parties[i];
                        let time = new Date(party.endDate ? party.endDate : party.startDate);
                        //Tabellen auswahl, je nach dem ob das event vor oder nach jetzt ist
                        if (time < timeNow)
                            contentVue.eventsPast.push(party);
                        else
                            contentVue.eventsFuture.push(party);
                    }
                }
            });
    }
});


if (contentVue.owner) {
    let apiKey = localStorage.getItem("apiKey");
    let userList;

    getRequest("user?api=" + apiKey, function (data) {
        if (!data.error && data.values) {
            userList = data.values;
        }
    });

    function getSearchResults() {
        return userList.filter(function (obj) {
            return contentVue.searchString && obj.name.toLowerCase().startsWith(contentVue.searchString.toLowerCase());
        });
    }

    function addContact(id) {
        putRequest("user/contact?api=" + apiKey, JSON.stringify({'userid': id}), function (data) {
            console.log("contact added: " + data);
        });
    }
}
/*
 * Popups Initialisieren
 */
const popupVue = new PopupHandler('.popup-container',
    {
        'delete': false,
        'search': false
    },
    {
        'delete': contentVue.deleteProfile,
        'search_results': getSearchResults, 'search_confirm': addContact
    });