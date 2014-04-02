#!/usr/bin/env node
var argv = require('optimist').argv;
var denver = require('./index');

var settings = {
	host:process.env.DENVER_HOST || argv.host || '127.0.0.1',
	port:process.env.DENVER_PORT || argv.port || 4001,
	key:process.env.DENVER_KEY || argv.key || '/denver'
}

console.log('-------------------------------------------');
console.log('-------------------------------------------');
console.dir(argv);
