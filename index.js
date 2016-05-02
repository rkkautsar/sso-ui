var CAS            = require('cas-authentication');
var orgCodeDetails = require('./org_code_details.json');

function SSO(options) {
	var session_sso = options.session_sso || 'sso_user';	

    this.cas = new CAS({
        cas_url: "https://sso.ui.ac.id/cas2",
        service_url: options.url,
        cas_version: '2.0',
        session_name: options.session_sso,
        session_info: options.session_sso + '_info',
    });

    this.login = function(req, res, next) {

        var sso = this;

        var inject_next = function() {
           sso.user = {
                username: req.session[options.session_sso],
                fullname: req.session[options.session_sso + '_info'].nama,
                role: req.session[options.session_sso + '_info'].peran_user,
                npm: req.session[options.session_sso + '_info'].npm,
                org_code: req.session[options.session_sso + '_info'].kd_org,
                org: orgCodeDetails[req.session[options.session_sso + '_info'].kd_org]
            };

            next();
        };

        this.cas.bounce(req, res, inject_next);
    };

    this.block = function(req, res, next) {
        this.cas.block(req, res, next);
    };

    this.clear = function(req, res, next) {
        req.session.destroy();
        next();
    };

    this.logout = this.cas.logout;

    this.login = this.login.bind(this);
    this.block = this.block.bind(this);
}

module.exports = SSO;