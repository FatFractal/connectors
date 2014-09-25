var require = require,
    exports = exports,
    ff = require('ffef/FatFractal'),
    sf = require('scripts/SalesForce'),
    log = function(str) { ff.logger.info("SampleCollection: " + str)},
    useSandbox      = false,
    username        = ff.getFfdlSetting("SalesForce.username"),
    password        = ff.getFfdlSetting("SalesForce.password"),
    securityToken   = ff.getFfdlSetting("SalesForce.securityToken"),
    clientId        = ff.getFfdlSetting("SalesForce.clientID"),
    clientSecret    = ff.getFfdlSetting("SalesForce.clientSecret");

exports.retrieve = function(paramObject) {
    // log in
    var loginResponse = sf.login(username, password, securityToken, clientId, clientSecret, useSandbox),
        instanceUrl = loginResponse['instance_url'],
        accessToken = loginResponse['access_token'];

    // perform query
    var sfTable = "Person__c",
        requestUri = paramObject['requestUri'],
        guid = paramObject['guid'],
        query = "SELECT Id, First_Name__c, Last_Name__c, Birthdate__c FROM " + sfTable;

    if (guid) {
        query += " WHERE Id='" + guid + "'";
    }
    
    var queryResponse = sf.query(instanceUrl, accessToken, query),
        rawResults = queryResponse['records'],
        results = [];

    for (var i = 0; i < rawResults.length; i++) {
        var rr = rawResults[i],
            d = new Date(rr['Birthdate__c'] + "T00:00:00.000Z"),
            obj = {
                clazz: "Person",
                guid: rr['Id'],
                firstName: rr['First_Name__c'],
                lastName: rr['Last_Name__c'],
                birthdate: d
            };
        results.push(obj);
    }

    return results;
};
