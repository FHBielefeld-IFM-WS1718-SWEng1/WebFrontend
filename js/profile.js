const rootVue = new Vue({
    el: '#content',
    data: {
        email: "",
        name: "",
        birthdate: "",
        gender: 0
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
        }

    }
});


var split = /(id=)(\d+)/g.exec(window.location.href);
var userId = (split != null && split.length > 0) ? split[2] : 23;
console.log("User Id" + userId);
var apiKey = localStorage.getItem("apiKey");
console.log("API Key: " + apiKey);
getRequest("user/" + userId + "?api=" + apiKey, function (data) {
    if (!data.error) {
        rootVue.email = data.email;
        rootVue.name = data.name;
        rootVue.birthdate = data.birthdate;
        rootVue.gender = data.gender;
    }
});

