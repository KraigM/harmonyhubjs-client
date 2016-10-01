'use strict'

var util = require('util');

/*
 * The PLAIN SASL Mechanism in node-xmpp-client sends authzid with auth(). It was determined
 * in (https://github.com/e7hz3r0/node-xmpp/commit/c310683baa9903eed4ad85d01f14019c56ba678a) that
 * it was not supported by HarmonyLink.
 */

var lastLinkCls;
var lastBaseCls;

function createLinkClass(mechCls) {
	if (lastLinkCls && lastBaseCls === mechCls) {
		return lastLinkCls;
	}

	var Link = function () {};
	util.inherits(Link, mechCls);
	Link.prototype.name = mechCls.prototype.name;
	Link.prototype.auth = function () {
		var rtn = mechCls.prototype.auth.apply(this, arguments);
		var rm = this.authzid + '';
		return rtn && rtn.substr(0, rm.length) === rm ? rtn.substr(rm.length) : rtn;
	};

	lastBaseCls = mechCls;
	return lastLinkCls = Link;
}

function injectSaslAuth(availableSaslMechanisms) {
	for (var i = 0, len = availableSaslMechanisms.length; i < len; i++) {
		var mechCls = availableSaslMechanisms[i];
		if (mechCls.prototype.name === 'PLAIN') {
			availableSaslMechanisms[i] = createLinkClass(mechCls);
		}
	}
}

module.exports = injectSaslAuth;
