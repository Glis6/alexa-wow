[![Build Status](https://travis-ci.org/bespoken/alexa-skills-kit-nodejs-lambda-boilerplate.svg?branch=master)](https://travis-ci.org/bespoken/alexa-skills-kit-nodejs-lambda-boilerplate)

This is an over engineered, highly opinionated hello world for Alexa Skills.  It is a great boilerplate for starting Alexa Skills that have:

* TypeScript & Webpack
* Testing with Coverage
* Integration with Bespoken Tools

Commands:

Install:
```
$ npm install
```

Start Webpack & BST Proxy:
```
$ npm run start
```

Run unit tests:
```
$ npm run test
```

Run functional tests:
```
$ npm run ftest
```

Other things to Try:

With `$npm run start` running, in a new terminal:

```
$ bst speak say hello
```

```
$ bst speak say hello in {esperanto}
```

```
$ bst intend WorldlyHelloIntent Language=welsh
```
