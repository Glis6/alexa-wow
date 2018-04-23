[![Build Status](https://travis-ci.org/bespoken/alexa-skills-kit-nodejs-lambda-boilerplate.svg?branch=master)](https://travis-ci.org/bespoken/alexa-skills-kit-nodejs-lambda-boilerplate) [![Coverage Status](https://coveralls.io/repos/github/bespoken/alexa-skills-kit-nodejs-lambda-boilerplate/badge.svg?branch=master)](https://coveralls.io/github/bespoken/alexa-skills-kit-nodejs-lambda-boilerplate?branch=master)

This is an over engineered, highly opinionated hello world for Alexa Skills.  It is a great boilerplate for starting Alexa Skills that have:

* TypeScript & Webpack
* Testing with Coverage
* Integration with Bespoken Tools

## Setup

Install
```
$ npm install
```

Create a .env file for configuration at the project root, example .env file:
```
BST_SECRET_KEY=YOUR_SECRET_KEY
```

Get your BST_SECRET_KEY from https://bespoken.tools/dashboard

Install BST CLI globally:
__Not required but helpful__
```
$ npm install -g bespoken-tools
```

## Recommended IDE

* [VS Code](https://code.visualstudio.com/)
  - With [TSLint extension](https://marketplace.visualstudio.com/items?itemName=eg2.tslint) (also [seti-icons](https://marketplace.visualstudio.com/items?itemName=qinjia.seti-icons) are highly recommended)

## Commands

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

### Other things to Try:

With `$npm run start` running, in a new terminal:
__Note you must have the BST CLI installed globally__

```
$ bst speak say hello
```

```
$ bst speak say hello in {esperanto}
```

```
$ bst intend WorldlyHelloIntent Language=welsh
```