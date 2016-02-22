express-sso
===========

![npm badge](https://img.shields.io/npm/v/express-sso.svg)

A middleware for express.js to authenticate user through SSO-UI.

## Usage
Install through npm (you may have to add `sudo`):
```
npm install --save express-sso
```

Then require it in your app:
```
var SSO = require('express-sso');
```

And make an object:
```
var sso = new SSO({
	url: 'http://localhost:3000', //required
	session_sso: 'user' // defaults to user
});
```

### Login
```
app.get('/login', sso.login, function(req, res) {
    res.redirect('/');
});
```

### Logout
```
app.get('/logout-sso', sso.logout);
```

### Clear session
```
app.get('/logout', sso.clear, function(req, res) {
	res.redirect('/');
});
```

### Block if not authenticated
```
app.get('/route/to/critical/data', sso.block, function(req, res) {
	res.json({ success: true });
});
```

### Get user after authenticated
```
console.log(req.session.user); // undefined if not authenticated
console.log(req.session.user.username);
console.log(req.session.user.name);
console.log(req.session.user.role);
console.log(req.session.user.npm);
console.log(req.session.user.org_code);
console.log(req.session.user.org.faculty);
console.log(req.session.user.org.study_program);
console.log(req.session.user.org.educational_program);
```

## Additional Info
Make sure you have `express-session` before you use this middleware. An example to use `express-session`:
```
var app = require('express')();
var session = require('express-session');

app.use(session({
    secret: 'supersecretkey',
    resave: false,
    saveUninitialized: true
}));
```

The details of organizational code was taken from [ristek/sso](https://github.com/RistekCSUI/SSO).