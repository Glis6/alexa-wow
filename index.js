require("dotenv").config();

const handler = require("./dist").default; // the generated module
const bst = require('bespoken-tools');

exports.handler = bst.Logless.capture(process.env.BST_SECRET_KEY, handler);