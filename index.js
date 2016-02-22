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

    this.logout = function(req, res, next) {
        req.session.destroy();
        next();
    };

    this.setUser = function(user) {
        this.user = user;
    };

    this.getUser = function() {
        return this.user;
    };

    this.login = this.login.bind(this);
    this.block = this.block.bind(this);
    this.getUser = this.getUser.bind(this);
    this.setUser = this.setUser.bind(this);
}

module.exports = SSO;