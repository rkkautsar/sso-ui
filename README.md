sso-ui
======
![npm badge](https://img.shields.io/npm/v/sso-ui.svg)

A middleware for express.js to authenticate user through SSO-UI.

## Usage
Install through npm (you may have to add `sudo`):
```sh
npm install --save sso-ui
```

Then require it in your app:
```js
var SSO = require('sso-ui');
```

Make an object and middlewares:
```js
var app = require('express')();
var session = require('express-session');

var sso = new SSO({
	url: 'http://localhost:3000', //required
	session_sso: 'sso_user' // defaults to sso_user
});

app.use(session({
    secret: 'supersecretkey',
    resave: false,
    saveUninitialized: true
}));

app.use(sso.middleware);
```

### Login
```js
app.get('/login', sso.login, function(req, res) {
    res.redirect('/');
});
```

### Logout
```js
app.get('/logout-sso', sso.logout);
```

### Clear session
```js
app.get('/logout', sso.clear, function(req, res) {
	res.redirect('/');
});
```

### Block if not authenticated
```js
app.get('/route/to/critical/data', sso.block, function(req, res) {
	res.json({ success: true });
});
```

### Get user after authenticated
```js
var user = req.sso_user; // or whatever your session_sso is set to
if (user) {
    console.log(user);
    // should be equals to
    console.log({
        username: user.username,
        name: user.name,
        role: user.role,
        npm: user.npm,
        org_code: user.org_code,
        org: {
            study_program: user.org.study_program,
            educational_program: user.org.educational_program
        }
    });
}
```

## Additional Info
The details of organizational code was taken from [ristek/sso](https://github.com/RistekCSUI/SSO).