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
            var info = req.session[session_sso + '_info'];
            var user = {};

            user.username = req.session[session_sso];
            user.name = info.nama;
            user.role = info.peran_user;

            if (user.role === "mahasiswa") {
                user.npm = info.npm;
                user.org_code = info.kd_org;
                
                data = orgCodeDetails[user.org_code];
                user.faculty = data.faculty;
                user.study_program = data.study_program;
                user.educational_program = data.educational_program;
            } else if (user.role === "staff") {
                user.nip = info.nip;
            }

            req[session_sso] = user;
        } else {
            req[session_sso] = null;
        }

        next();
    }

    this.clear = function(req, res, next) {
       req.session[session_sso] = null;
       req.session[session_sso + '_info'] = null;
       next();
    };

    this.login = this.cas.bounce;
    this.block = this.cas.block;
    this.logout = this.cas.logout;

    this.clear = this.clear.bind(this);
}

module.exports = SSO;