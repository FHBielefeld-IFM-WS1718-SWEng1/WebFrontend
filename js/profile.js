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
            console.log("Profil Update für " + this.name + ", " + this.birthdate + ", " + this.gender);
            putRequest("users/23?api=" + apiKey, JSON.stringify({
                "name": this.name,
                "birthdate": this.birthdate
            }), function (data) {
                console.log("Sent, data: " + data + ", json: " + JSON.stringify(data));
            });
        },
        deleteProfile() {

        }

    }
});

var apiKey = localStorage.getItem("apiKey");
console.log("API Key: " + apiKey);
getRequest("users/23?api=" + apiKey, function (data) {
    if (!data.error) {
        rootVue.email = data.email;
        rootVue.name = data.name;
        rootVue.birthdate = data.birthdate;
        rootVue.gender = data.gender;
    }
});

