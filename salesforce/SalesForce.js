var require = require,
    exports = exports,
    http = require('ringo/httpclient'),
    LOGIN_URL = "https://login.salesforce.com/services/oauth2/token",
    SANDBOX_LOGIN_URL = "https://test.salesforce.com/services/oauth2/token",
    API_VERSION = "v25.0";
	
exports.login = function(username, password, securityToken, clientId, clientSecret, useSandbox) {
	var data =	{
        grant_type: "password",
		client_id: clientId,
		client_secret: clientSecret,
		username: username,
		password: password + securityToken
    };
	var url = (useSandbox) ? SANDBOX_LOGIN_URL : LOGIN_URL;

    return JSON.parse(http.post(url, data).content);
};

exports.query = function(instanceUrl, accessToken, queryString) {
	var url = instanceUrl + "/services/data/" + API_VERSION + "/query";
	var data = {q: queryString};
	
	var request = {
        url: url,
		data: data,
		method: "GET",
		headers: {
			Authorization: "Bearer " + accessToken
		}
	};

    return JSON.parse(http.request(request).content);
};

exports.update = function(instanceUrl, accessToken, dataUrl, data) {
    var url = instanceUrl + dataUrl + "?_HttpMethod=PATCH";

    var request = {
        url: url,
        data: JSON.stringify(data),
        method: "POST",
        contentType: "application/json",
        headers: {
            Authorization: "Bearer " + accessToken
        },
        error: function(message, status) {
            print("error: " + message + " " + status);
        },
        complete: function(content, status, contentType) {
            print("done! status: " + status);
        }
    };

    return http.request(request).status;
};
