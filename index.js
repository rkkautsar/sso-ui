var CAS            = require('cas-authentication');
var orgCodeDetails = require('./org_code_details.json');

function SSO(options) {
	var session_sso = options.session_sso || 'sso_user';	

    this.cas = new CAS({
        cas_url: "https://sso.ui.ac.id/cas2",
        service_url: options.url,
        cas_version: '2.0',
        session_name: session_sso,
        session_info: session_sso + '_info',
    });

    this.middleware = function(req, res, next) {
        if (req.session[session_sso]) {
            req[session_sso] = {
                username: req.session[session_sso],
                fullname: req.session[session_sso + '_info'].nama,
                role: req.session[session_sso + '_info'].peran_user,
                npm: req.session[session_sso + '_info'].npm,
                org_code: req.session[session_sso + '_info'].kd_org,
                org: orgCodeDetails[req.session[session_sso + '_info'].kd_org]
            };
        } else {
            req[session_sso] = null;
        }

        next();
    }

    this.clear = function(req, res, next) {
       req.session.destroy();
       this.user = null;
       next();
    };

    this.login = this.cas.bounce;
    this.block = this.cas.block;
    this.logout = this.cas.logout;

    this.clear = this.clear.bind(this);
}

module.exports = SSO;