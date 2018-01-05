function papla_login(email, password, callback)
{
    postRequest("login",
        JSON.stringify({"email": email, "password": password}),
        function (data) {
            if(data.key) {
                console.log("Received API Key: " + data.key);
                localStorage.setItem("apiKey", data.key);
                localStorage.setItem("userId", data.id);
                localStorage.setItem("userName", data.name);
            }
            if(callback)
                callback(data.key);
        });
}

function papla_logout(apiKey)
{
    deleteRequest("logout?api="+apiKey,
        function (data) {
            if(data.key) {
                console.log("Invalidated API Key: " + data.key);
            }
        });
    localStorage.removeItem("apiKey");
    str = window.location.href;
    str = str.replace(/(\/[\w]+\.html)[\S]*/g, "/index.html");
    window.location.replace(str);
}