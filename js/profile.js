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
                console.log("Sent, data: " + data + ", json: " + JSON.stringify(data));
            });
        },
        confirmDelete() {
            popupVue.showPopup('delete')
        },
        deleteProfile() {
            console.log("Do the delete!");
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
console.log("API Key: " + apiKey);
contentVue.owner = userId === loggedInId;
console.log("Is Owner: " + contentVue.owner);
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

