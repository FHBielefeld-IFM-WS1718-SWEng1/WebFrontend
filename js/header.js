const naviVue = new Vue({
    el: '#navi',
    data: {
        name: ""
    }
});

var loggedInId = localStorage.getItem("userId");
var split = /(id=)(\d+)/g.exec(window.location.href);
var userId = (split != null && split.length > 0) ? split[2] : loggedInId;
var apiKey = localStorage.getItem("apiKey");
getRequest("user/" + userId + "?api=" + apiKey, function (data) {
    if (!data.error) {
        naviVue.name = data.name;
    }
});