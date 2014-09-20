var require = require,
    exports = exports,
    print = print,
    ff = require('ffef/FatFractal'),
    sf = require('scripts/SalesForce');

exports.retrieve = function() {
    var useSandbox      = false,
        username        = "your_user_name",
        password        = "your_password",
        securityToken   = "security_token",
        clientId        = "client_id",
        clientSecret    = "client_secret";

    // log in
    var loginResponse = sf.login(username, password, securityToken, clientId, clientSecret, useSandbox),
        instanceUrl = loginResponse['instance_url'],
        accessToken = loginResponse['access_token'];
	
	// perform query
    var sfTable = "Some_Table__c",
        requestUri = paramObject['requestUri'],
        guid = paramObject['guid'],
        query = "SELECT * FROM " + sfTable;

    if (guid) {
        query += " WHERE Id = " + guid;
    }
    
    var queryResponse = sf.query(instanceUrl, accessToken, query);

    return queryResponse['records'];
};
