var CAS            = require('cas-authentication');
var orgCodeDetails = require('./org_code_details.json');

function SSO(options) {
	var session_sso = options.session_sso || 'user';	

    this.cas = new CAS({
        cas_url: "https://sso.ui.ac.id/cas2",
        service_url: options.url,
        cas_version: '2.0',
        session_name: 'sso_user',
        session_info: 'sso_info',
    });

    this.login = function(req, res, next) {
        
        inject_next = function() {
            req.session[session_sso] = {
                username: req.session.sso_user,
                fullname: req.session.sso_info.nama,
                role: req.session.sso_info.peran_user,
                npm: req.session.sso_info.npm,
                org_code: req.session.sso_info.kd_org,
                org: orgCodeDetails[req.session.sso_info.kd_org]
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