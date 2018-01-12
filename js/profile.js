const contentVue = new Vue({
    el: '#content',
    data: {
        email: "",
        name: "",
        birthdate: "",
        gender: 0,
        image: "img/logo.png",
        imageChanged: false,
        imagePath: "",
        userId: -1,
        owner: true,
        contactList: [],
        searchString: "Tim",
        eventsPast: [],
        eventsFuture: []
    },
    methods: {
        updateProfile() {
            if (!this.imageChanged)
                this.doUpdate();
            else { //Wenn das Nutzerbild geändert wurde ist der Vorgang etwas komplizierter
                postRequest("image/?api=" + localStorage.getItem("apiKey"), JSON.stringify({"data": this.image}), function (data) {
                    console.log("Image was uploaded: "+JSON.stringify(data));
                    if(data.filename)
                    {
                        contentVue.imageChanged = false;
                        contentVue.imagePath = data.filename;
                    }
                    console.log("Updated userdata: "+JSON.stringify(userObject));
                    contentVue.doUpdate(userObject);
                });
            }
        },
        doUpdate()
        {
            let userObject = {
                "name": this.name,
                "birthdate": this.birthdate,
                "gender": parseInt(this.gender),
                "profilepicture": this.imagePath
            };
            putRequest("user/" + this.userId + "?api=" + localStorage.getItem("apiKey"), JSON.stringify(userObject), function (data) {
                console.log("update performed: "+JSON.stringify(data));
                if (!data.error && data.name)
                    localStorage.setItem("userName", data.name);
                naviVue.refreshName();
            });
        },
        confirmDelete() {
            popupVue.showPopup('delete');
        },
        deleteProfile() {
            deleteRequest("user/" + this.userId + "?api=" + localStorage.getItem("apiKey"), function (data) {
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
        this.userId = (split != null && split.length > 0) ? split[2] : loggedInId;
        let apiKey = localStorage.getItem("apiKey");

        this.owner = this.userId === loggedInId;
        //Nutzerdaten abrufen
        getRequest("user/" + this.userId + "?api=" + apiKey, function (data) {
            if (!data.error) {
                console.log("userdata: "+JSON.stringify(data));
                contentVue.email = data.email;
                contentVue.name = data.name;
                contentVue.birthdate = data.birthdate;
                contentVue.gender = data.gender;
                if (data.profilepicture) {
                    contentVue.imagePath = data.profilepicture;
                    console.log("profilepicture: "+data.profilepicture);
                    getRequest("image/" + data.profilepicture + "?api=" + apiKey, function (data) {
                        console.log("picturedata: "+JSON.stringify(data));
                        if (!data.data)
                            contentVue.image = data.data;
                    });
                }
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
        if (!contentVue.searchString)
            return null;
        return userList.filter(function (obj) {
            return obj.name.toLowerCase().startsWith(contentVue.searchString.toLowerCase()) && !nameInContacts(obj);
        });
    }

    function nameInContacts(obj) {
        let found = false;
        contentVue.contactList.forEach(function (user) {
            if (user.id === obj.id) {
                found = true;
                return;
            }
        });
        return found;
    }

    function addContact(id) {
        postRequest("user/contact?api=" + apiKey, JSON.stringify({'userid': id}), function (data) {
            if (!data.error)
                getRequest("user/contact?api=" + apiKey, function (data) {
                    if (!data.error && data.contacts) {
                        contentVue.contactList = data.contacts;
                    }
                });
        });
    }

    function selectProfilePicture(evt) {
        var dateien = evt.target.files;
        var uploadDatei = dateien[0];
        console.log("selected file: " + uploadDatei);

        // Ein Objekt um Dateien einzulesen
        var reader = new FileReader();

        // Wenn der Dateiinhalt ausgelesen wurde...
        reader.onload = function (theFileData) {
            if (theFileData.target.result !== contentVue.image) {
                contentVue.image = theFileData.target.result; // Ergebnis vom FileReader auslesen
                // console.log("*image data: " + contentVue.image);
                contentVue.imageChanged = true;
                console.log("New image!!");
            }
            else
                console.log("Old image!!");
            /*
            Code für AJAX-Request hier einfügen
            */
        }
        // Die Datei einlesen und in eine Data-URL konvertieren
        reader.readAsDataURL(uploadDatei);
    }

    document.getElementById('uploadButton').addEventListener('change', selectProfilePicture, false);
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