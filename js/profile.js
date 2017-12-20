const rootVue = new Vue({
    el: '#content',
    data: {
        email: "",
        name: "",
        birthdate: "",
        gender: ""
    },
    methods: {
        updateProfile() {
            var json = JSON.stringify({
                "name": this.name,
                "birthdate": this.birthdate
            });
            console.log("Profil Update mit: " + json);
            putRequest("users/"+userId+"?api=" + apiKey, json, function (data) {
                console.log("Sent, data: " + data + ", json: " + JSON.stringify(data));
            });
        },
        deleteProfile() {

        }

    }
});

var split = /(id=)(\d+)/g.exec(window.location.href);
var userId = (split!=null && split.length>0)?split[2]:23;
console.log("User Id" + userId);
var apiKey = localStorage.getItem("apiKey");
console.log("API Key: " + apiKey);
getRequest("users/"+userId+"?api=" + apiKey, function (data) {
    if (!data.error) {
        rootVue.email = data.email;
        rootVue.name = data.name;
        rootVue.birthdate = data.birthdate;
        rootVue.gender = data.gender;
    }
});

