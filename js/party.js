var options = {
    year: "numeric", month: "short",
    day: "numeric", hour: "2-digit", minute: "2-digit"
};

const contentVue = new Vue({
        el: '#content',
        data: {
            partyId: -1,
            partyname: "",
            description: "",
            gastgeber: "",
            ort: "",
            startDatum: "",
            startZeit: "",
            endDatum: "",
            endZeit: "",
            image: "img/logo.png",
            imageChanged: false,
            imagePath: "",
            guests: [],
            tasks: [],
            enableRating: false,
            ratingSelected: null,
            ratingAverage: null,
            ratingTotal: 0,
            comments: [],
            tempComment: "",
            tempReply: "",

            addingTask: false,
            contactList: [],
            invitePlanningList: [],
            guestToDelete: null,
            addTaskUsers: [],
            owner: true,
            isCreation: true
        },
        methods: {
            canEdit() {
                return owner && new Date(data.startDate) > new Date();
            },
            updateParty() {
                if (!this.imageChanged)
                    this.doUpdate();
                else { //Wenn das Nutzerbild geändert wurde ist der Vorgang etwas komplizierter
                    let imageTruncated = this.image.substring(this.image.indexOf("base64") + 7);
                    postRequest("image/?api=" + localStorage.getItem("apiKey"), JSON.stringify({"data": imageTruncated}), function (data) {
                        if (data.filename) {
                            contentVue.imageChanged = false;
                            contentVue.imagePath = data.filename;
                        }
                        contentVue.doUpdate();
                    });
                }
            },
            doUpdate() {
                let partyObject = {
                    "name": this.partyname,
                    "description": this.description,
                    "location": this.ort,
                    "startDate": this.startDatum + "T" + this.startZeit + "Z",
                    "picture": this.imagePath
                };
                if (this.endDatum && this.endZeit)
                    partyObject["endDate"] = this.endDatum + "T" + this.endZeit + "Z";
                if (this.isCreation)
                    postRequest("party?api=" + localStorage.getItem("apiKey"), JSON.stringify(partyObject), function (data) {
                        if (data.id) {
                            let str = window.location.href;
                            str = str.replace(/(\/[\w]+\.html)[\S]*/g, "/party.html?id=" + data.id);
                            window.location.replace(str);
                        }
                    });
                else
                    putRequest("party/" + this.partyId + "?api=" + localStorage.getItem("apiKey"), JSON.stringify(partyObject), function (data) {
                    });
            },
            confirmDelete() {
                popupVue.showPopup('delete');
            },
            deleteParty() {
                deleteRequest("party/" + this.partyId + "?api=" + localStorage.getItem("apiKey"), null, function (data) {
                    popupVue.hidePopup('delete');
                    if (data.message === "erfolgreich") {
                        let str = window.location.href;
                        str = str.replace(/(\/[\w]+\.html)[\S]*/g, "/home.html");
                        window.location.replace(str);
                    }
                });
            },
            mapsAufrufen() {
                window.open("https://www.google.com/maps?daddr=" + this.ort);
            },
            changeTab(event, tab) {
                let tabcontent = document.getElementsByClassName("tabcontent");
                for (let i = 0; i < tabcontent.length; i++)
                    if (!tabcontent[i].className.includes("inactive"))
                        tabcontent[i].className += " inactive";
                let tablinks = document.getElementsByClassName("tablinks");
                for (let i = 0; i < tablinks.length; i++)
                    if (!tablinks[i].className.includes("inactive"))
                        tablinks[i].className += " inactive";
                event.target.className = event.target.className.replace(" inactive", "");
                let tabElement = document.getElementById(tab);
                tabElement.className = tabElement.className.replace(" inactive", "");
            },
            showAddGuests() {
                popupVue.showPopup('addGuests');
            },
            addGuests() {
                while (this.invitePlanningList.length > 0) {
                    let user = this.invitePlanningList.pop();
                    let guestobj = JSON.stringify({"userid": user.id, "partyid": this.partyId});
                    postRequest("party/guest?api=" + localStorage.getItem("apiKey"), guestobj, function (data) {
                        getRequest("party/" + contentVue.partyId + "?api=" + localStorage.getItem("apiKey"), function (data) {
                            if (data.guests)
                                contentVue.guests = data.guests;
                        });
                    });
                }
            },
            confirmDeleteGuest(user) {
                this.guestToDelete = user;
                popupVue.showPopup('deleteGuest');
            },
            deleteGuest() {
                if (this.guestToDelete)
                    deleteRequest("party/guest?api=" + localStorage.getItem("apiKey"), JSON.stringify({"id": this.guestToDelete.id}), function (data) {
                        popupVue.hidePopup('deleteGuest');
                        for (let i = 0; i < contentVue.guests.length; i++)
                            if (contentVue.guests[i].user_id === contentVue.guestToDelete.user_id)
                                contentVue.guests.splice(i, 1);
                        contentVue.contactToDelete = null;
                    });
            },
            buildTaskUserList() {
                this.addTaskUsers.length = 0;
                this.addTaskUsers.push({
                    "user_id": parseInt(localStorage.getItem("userId")),
                    "user_name": localStorage.getItem("userName")
                });
                for (let iGuest = 0; iGuest < this.guests.length; iGuest++)
                    this.addTaskUsers.push({
                        "user_id": this.guests[iGuest].user_id,
                        "user_name": this.guests[iGuest].User.name
                    });
            },
            addTask() {
                let selection = document.getElementById("addTaskUser");
                let message = JSON.stringify({
                    "user_id": selection.options[selection.selectedIndex].value,
                    "party_id": contentVue.partyId,
                    "text": document.getElementById("addTaskName").value,
                    "status": 0
                });
                const apiKey = localStorage.getItem("apiKey");
                postRequest("party/task?api=" + apiKey, message, function (data) {
                    if (!data.error)
                        contentVue.tasks.push(data);
                    contentVue.addingTask = false;
                });
            },
            canUpdateTask(task) {
                return this.owner || task.user_id === parseInt(localStorage.getItem("userId"));
            },
            updateTask(task, event) {
                if (!this.canUpdateTask(task)) {
                    event.target.checked = !event.target.checked;
                    return;
                }
                task.status = event.target.checked ? 1 : 0;
                putRequest("party/task?api=" + localStorage.getItem("apiKey"), JSON.stringify(task), function (data) {
                });
            },
            deleteTask(task, arrayIndex) {
                const c_arrayIndex = arrayIndex;
                deleteRequest("party/task?api=" + localStorage.getItem("apiKey"), JSON.stringify({"id": task.id}), function (data) {
                    if (!data.error)
                        contentVue.tasks.splice(c_arrayIndex, 1);
                });
            },
            clickRating(rating) {
                postRequest("party/rating?api=" + localStorage.getItem("apiKey"), JSON.stringify({"partyid": this.partyId, "rating": rating}), function (data) {
                });
                let newAverage = (this.ratingAverage * this.ratingTotal + rating) / (this.ratingTotal + 1);
                this.ratingAverage = Number(Math.round(newAverage + 'e2') + 'e-2');
            }
        },
        computed: {
            allowRating() {
                return this.ratingSelected != null;
            }
        },
        created: function () {
            const now = new Date();
            let nowString = now.toISOString().split('T');
            this.startDatum = nowString[0];
            this.startZeit = nowString[1].substring(0, 5) + ":00.000";

            let split = /(id=)(\d+)/g.exec(window.location.href);
            const apiKey = localStorage.getItem("apiKey");
            this.partyId = (split != null && split.length > 0) ? split[2] : -1;
            this.gastgeber = localStorage.getItem("userName");
            if (this.partyId !== -1) //Existierende Party
                getRequest("party/" + this.partyId + "?api=" + apiKey, function (data) {
                    if (!data.error) {
                        //Parties die angefangen haben können nicht geändert werden
                        let myUserId = parseInt(localStorage.getItem("userId"));
                        if (data.ersteller.id !== myUserId)
                            contentVue.owner = false;

                        contentVue.isCreation = false;
                        contentVue.partyname = data.name;
                        contentVue.description = data.description;
                        contentVue.gastgeber = data.ersteller.name;

                        contentVue.ort = data.location;
                        if (data.startDate) {
                            let splitTime = data.startDate.split("T");
                            contentVue.startDatum = splitTime[0];
                            contentVue.startZeit = splitTime[1].substring(0, splitTime[1].length - 1);
                        }
                        if (data.endDate) {
                            let splitTime = data.endDate.split("T");
                            contentVue.endDatum = splitTime[0];
                            contentVue.endZeit = splitTime[1].substring(0, splitTime[1].length - 1);
                        }

                        contentVue.guests = data.guests;
                        contentVue.tasks = data.tasks;
                        contentVue.comments = data.comments;

                        //Rating zulassen, wenn die Party vorbei ist
                        // if (new Date(!data.endDate ? data.startDate : data.endDate) < now)
                        contentVue.enableRating = true;
                        if (data.ratingAverage)
                            contentVue.ratingAverage = Number(Math.round(data.ratingAverage + 'e2') + 'e-2');
                        contentVue.ratingTotal = data.ratings.length;
                        for (let iRating = 0; iRating < contentVue.ratingTotal; iRating++)
                            if (data.ratings[iRating].user_id === myUserId)
                                contentVue.ratingSelected = data.ratings[iRating].value.toString();


                        if (data.picture) {
                            contentVue.userimagePath = data.picture;
                            getRequest("image/" + data.picture + "?api=" + apiKey, function (data) {
                                if (data.data) {
                                    contentVue.image = "data:image/png;base64," + data.data;
                                }
                            });
                        }

                        if (contentVue.owner) {
                            contentVue.buildTaskUserList();
                            getRequest("user/contact?api=" + apiKey, function (data) {
                                if (data.contacts)
                                    for (let i = 0; i < data.contacts.length; i++) {
                                        let isGuest = false;
                                        for (let j = 0; j < contentVue.guests.length; j++)
                                            if (contentVue.guests[j].user_id === data.contacts[i].id) {
                                                isGuest = true;
                                                break;
                                            }
                                        if (isGuest)
                                            continue;
                                        let contactObject = {
                                            "image": "img/logo.png",
                                            "index": i,
                                            "id": data.contacts[i].id,
                                            "name": data.contacts[i].name
                                        };
                                        if (!data.contacts[i].profilePicture)
                                            contentVue.contactList.push(contactObject);
                                        else
                                            getRequest("image/" + data.contacts[i].profilePicture + "?api=" + apiKey, function (data) {
                                                if (data.data)
                                                    contactObject.image = "data:image/png;base64," + data.data;
                                                contentVue.contactList.push(contactObject);
                                            });
                                    }
                            });
                        }
                    }
                });
        }
    })
;

if (contentVue.owner) {
    function selectPartyPicture(evt) {
        var dateien = evt.target.files;
        var uploadDatei = dateien[0];

        // Ein Objekt um Dateien einzulesen
        var reader = new FileReader();

        // Wenn der Dateiinhalt ausgelesen wurde...
        reader.onload = function (theFileData) {
            if (theFileData.target.result !== contentVue.image) {
                contentVue.image = theFileData.target.result; // Ergebnis vom FileReader auslesen
                contentVue.imageChanged = true;
            }
        };
        // Die Datei einlesen und in eine Data-URL konvertieren
        reader.readAsDataURL(uploadDatei);
    }

    document.getElementById('uploadButton').addEventListener('change', selectPartyPicture, false);
}

const popupVue = new PopupHandler('.popup-container',
    {
        'delete': false,
        'addGuests': false,
        'deleteGuest': false
    },
    {
        'delete': contentVue.deleteParty,
        'contactList': function () {
            return contentVue.contactList;
        },
        'planningList': function () {
            return contentVue.invitePlanningList;
        },
        'shiftList': function (args) {
            let user = args[0];
            let vueIndex = args[1];
            let toPlanning = args[2];
            if (toPlanning) {
                contentVue.invitePlanningList.splice(user.index, 0, user);
                contentVue.contactList.splice(vueIndex, 1);
            }
            else {
                contentVue.contactList.splice(user.index, 0, user);
                contentVue.invitePlanningList.splice(vueIndex, 1);
            }
        },
        'addGuests': contentVue.addGuests,
        'deleteGuest': contentVue.deleteGuest, 'deleteGuest_name': function () {
            return contentVue.guestToDelete.User.name;
        }
    });