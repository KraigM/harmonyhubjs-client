var login = require('./login')
var auth = require('./login/auth')
var HarmonyClient = require('./harmonyclient')

function createHarmonyClient (xmppClient) {
  return new HarmonyClient(xmppClient)
}

function getHarmonyClient (hubhost, hubport, email, password) {
    var getHarmonyClientWithToken = function (authToken) {
        return login(hubhost, hubport, authToken)
            .then(createHarmonyClient)
    };
    if (!email) {
        return getHarmonyClientWithToken();
    }
    return auth(email, password)
        .then(getHarmonyClientWithToken);
}

module.exports = getHarmonyClient
