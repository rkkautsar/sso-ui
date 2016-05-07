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

### Login (or Bounce)
```js
app.get('/login', sso.login, function(req, res) {
    res.redirect('/');
});

app.get('/user', sso.login, function(req, res) {
    res.json(req.sso_user);
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
    // if role is mahasiswa:
    console.log({
        username: user.username,
        name: user.name,
        role: user.role,
        npm: user.npm,
        org_code: user.org_code,
        faculty: user.faculty,
        study_program: user.study_program,
        educational_program: user.educational_program
    });
    // if role is staff:
    console.log({
        username: user.username,
        name: user.name,
        role: user.role,
        nip: user.nip
    });
}
```

## Additional Info
The details of organizational code was taken from [ristek/sso](https://github.com/RistekCSUI/SSO).