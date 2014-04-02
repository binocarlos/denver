var EventEmitter = require('events').EventEmitter;
var async = require('async');
var util = require('util');
var EtcdX = require('etcdx');

function Denver(options){
	EventEmitter.call(this);
	this._key = options.key || '/denver';
	this._etcd = new EtcdX({
		host:options.host || '127.0.0.1',
		port:options.port || 4001
	})
}

util.inherits(Denver, EventEmitter);

module.exports = Denver;

Denver.prototype.key = function(append){
	return this._key + (append || '');
}

Denver.prototype.env = function(stacks, done){
	var self = this;
	if(typeof(stacks)==='string'){
		stacks = [stacks];
	}

	var flat = {};

	async.forEachSeries(stacks, function(stack, nextstack){
		self._etcd.get(self.key('/' + stack), function(err, packet){
			if(err){
				return nextstack();
			}
			packet.node.nodes.forEach(function(node){
				var key = node.key.replace(self.key('/' + stack + '/'), '');
				flat[key] = node.value;
			})
			nextstack();
		})
	}, function(err){
		if(err){
			return done(err);
		}
		done(null, flat);
	})
}

Denver.prototype.ls = function(done){
	var self = this;
	this._etcd.get(this.key(), function(err, packet){
		if(err){
			return done(err);
		}

		var nodes = (packet.node.nodes || []).map(function(node){
			return node.key.replace(self.key() + '/', '');
		})

		done(null, nodes);
	});	
}

Denver.prototype.rm = function(stack, done){
	this._etcd.rmdir(this.key('/' + stack), done);
}

Denver.prototype.get = function(stack, key, done){
	this._etcd.get(this.key('/' + stack + '/' + key), function(err, packet){
		if(err){
			return done(null, '');
		}

		done(null, packet.node.value);
	});	
}

Denver.prototype.set = function(stack, key, value, done){
	var self = this;
	this._etcd.set(this.key('/' + stack + '/' + key), value, function(err){
		if(err){
			return done(err);
		}
		self.emit('set', stack, key, value);
		done();
	});	
}

Denver.prototype.del = function(stack, key, done){
	var self = this;
	this._etcd.del(this.key('/' + stack + '/' + key), function(err){
		if(err){
			return done(err);
		}
		self.emit('del', stack, key);
		done();
	});	
}

module.exports = function denver(options){
	options = options || {};
	return new Denver(options);
}