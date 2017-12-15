const rootVue = new Vue({
    el: '#content',
    data: {
        email: "",
        name: "",
        birthdate: "",
        gender: 0,
        owner: false
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
        deleteProfile() {
            if (confirm("Bist du dir sicher, dass du dein Profil löschen möchtest?\n(Dies kann nicht rückgängig gemacht werden)") == true) {
                deleteRequest("user/"+userId+"?api="+apiKey, function (data) {
                    console.log("Sent, data: " + data + ", json: " + JSON.stringify(data));
                });
            } else {
            }
        },
        getLocalizedGender() {
            return this.gender===1?"Männlich": this.gender===2?"Weiblich": this.gender===3?"Andere": "Keine Angabe";
        }

    }
});

var loggedInId = localStorage.getItem("userId");
var split = /(id=)(\d+)/g.exec(window.location.href);
var userId = (split != null && split.length > 0) ? split[2] : loggedInId;
var apiKey = localStorage.getItem("apiKey");
console.log("API Key: " + apiKey);
rootVue.owner = userId === loggedInId;
console.log("Is Owner: "+rootVue.owner);
getRequest("user/" + userId + "?api=" + apiKey, function (data) {
    if (!data.error) {
        rootVue.email = data.email;
        rootVue.name = data.name;
        rootVue.birthdate = data.birthdate;
        rootVue.gender = data.gender;
    }
});

