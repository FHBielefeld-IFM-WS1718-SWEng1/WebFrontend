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
        canEdit: true,
        contactList: [],
        searchString: "",
        contactToDelete: null,
        eventsPast: [],
        eventsFuture: []
    },
    methods: {
        updateProfile() {
            if (!this.imageChanged)
                this.doUpdate();
            else { //Wenn das Nutzerbild geändert wurde ist der Vorgang etwas komplizierter
                let imageTruncated = this.image.substring(this.image.indexOf("base64") + 7);
                postRequest("image/?api=" + localStorage.getItem("apiKey"), JSON.stringify({"data": imageTruncated}), function (data) {
                    console.log("Image was uploaded: " + JSON.stringify(data));
                    if (data.filename) {
                        contentVue.imageChanged = false;
                        contentVue.imagePath = data.filename;
                    }
                    contentVue.doUpdate();
                });
            }
        },
        doUpdate() {
            let userObject = {
                "name": this.name,
                "birthdate": this.birthdate,
                "gender": parseInt(this.gender),
                "profilePicture": this.imagePath
            };
            putRequest("user/" + this.userId + "?api=" + localStorage.getItem("apiKey"), JSON.stringify(userObject), function (data) {
                if (!data.error && data.name)
                    localStorage.setItem("userName", data.name);
                naviVue.refreshName();
            });
        },
        confirmDelete() {
            popupVue.showPopup('delete');
        },
        deleteProfile() {
            deleteRequest("user/" + this.userId + "?api=" + localStorage.getItem("apiKey"), null, function (data) {
                if (data.message === "erfolg") {
                    papla_logout(apiKey);
                }
            });
        },
        getLocalizedGender() {
            return this.gender === 1 ? "Männlich" : this.gender === 2 ? "Weiblich" : this.gender === 3 ? "Andere" : "Keine Angabe";
        },
        search() {
            if (getSearchResults().length > 0)
                popupVue.showPopup('search');
        },
        confirmDeleteContact(user) {
            this.contactToDelete = user;
            popupVue.showPopup('deleteContact');
        },
        deleteContact() {
            if (this.contactToDelete)
                deleteRequest("user/contact?api=" + localStorage.getItem("apiKey"), JSON.stringify({"userid": this.contactToDelete.id}), function (data) {
                    popupVue.hidePopup('deleteContact');
                    for (let i = 0; i < contentVue.contactList.length; i++)
                        if (contentVue.contactList[i].id === contentVue.contactToDelete.id)
                            contentVue.contactList.splice(i, 1);
                    contentVue.contactToDelete = null;
                });
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
            if (data.error === "kein gültiger api schlüssel")
                clearStorage();
            if (!data.error) {
                console.log("userdata: " + JSON.stringify(data));
                contentVue.email = data.email;
                contentVue.name = data.name;
                contentVue.birthdate = data.birthdate;
                contentVue.gender = data.gender;
                if (data.profilePicture) {
                    contentVue.imagePath = data.profilePicture;
                    getRequest("image/" + data.profilePicture + "?api=" + apiKey, function (data) {
                        if (data.data)
                            contentVue.image = "data:image/png;base64," + data.data;
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
            return obj.email !== contentVue.email && obj.name.toLowerCase().startsWith(contentVue.searchString.toLowerCase()) && !nameInContacts(obj);
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
            if (!data.error) {
                popupVue.hidePopup('search');
                getRequest("user/contact?api=" + apiKey, function (data) {
                    if (!data.error && data.contacts) {
                        contentVue.contactList = data.contacts;
                    }
                });
            }
        });
    }

    function selectProfilePicture(evt) {
        let dateien = evt.target.files;
        let uploadDatei = dateien[0];
        console.log("selected file: " + uploadDatei);

        // Ein Objekt um Dateien einzulesen
        let reader = new FileReader();

        // Wenn der Dateiinhalt ausgelesen wurde...
        reader.onload = function (theFileData) {
            if (theFileData.target.result !== contentVue.image) {
                contentVue.image = theFileData.target.result; // Ergebnis vom FileReader auslesen
                contentVue.imageChanged = true;
            }
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
        'search': false,
        'deleteContact': false
    },
    {
        'delete': contentVue.deleteProfile,
        'search_results': getSearchResults, 'search_confirm': addContact,
        'deleteContact': contentVue.deleteContact, 'deleteContact_name': function () {
            return contentVue.contactToDelete.name;
        }
    });