var denver = require('../');
var Etcd = require('etcdx');
var async = require('async');
var should = require('should');

describe('denver', function(){

	var settings = {
		host:process.env.DENVER_HOST || '127.0.0.1',
		port:process.env.DENVER_PORT || 4001,
		key:process.env.DENVER_KEY || '/denver/test'
	}

	function make_denver(){
		return denver({
			key:settings.key,
			host:settings.host,
			port:settings.port
		});
	}

	function make_etcd(){
		return new Etcd(settings);
	}

	beforeEach(function(done){

		this.timeout(1000);

		var client = make_etcd();

		client.rmdir(settings.key, function(error){
			setTimeout(done, 100);
		})
		
	})

	after(function(done){

		var client = make_etcd();
		client.rmdir(settings.key, function(error){
			setTimeout(done, 100);
		})
	})


	it('should be an Event Emitter', function(done) {
		var den = make_denver();

		den.on('stash', done);
		den.emit('stash');
	})

	it('should do a basic read and write and delete to a stack', function(done) {

		this.timeout(2000);

		var addhit = false;
		var delhit = false;

		var den = make_denver();

		den.on('set', function(stack, key, value){
			stack.should.equal('myapp');
			key.should.equal('ADMIN_EMAIL');
			value.should.equal('bob@thebuilder.com');
			addhit = true;
		})

		den.on('del', function(stack, key){
			stack.should.equal('myapp');
			key.should.equal('ADMIN_EMAIL');
			delhit = true;
		})

		async.series([
			function(next){
				den.set('myapp', 'ADMIN_EMAIL', 'bob@thebuilder.com', next);
			},
			function(next){
				den.get('myapp', 'ADMIN_EMAIL', function(err, val){
					if(err){
						throw err;
					}

					val.should.equal('bob@thebuilder.com');
					next();
				})
			},
			function(next){
				den.del('myapp', 'ADMIN_EMAIL', next);
			},
			function(next){
				den.get('myapp', 'ADMIN_EMAIL', function(err, val){
					if(err){
						throw err;
					}

					val.should.equal('');
					addhit.should.equal(true);
					delhit.should.equal(true);
					next();
				})
			}
		], done)
		
  })

  it('should list stacks', function(done) {

  	this.timeout(2000);

		var den = make_denver();

		async.series([
			function(next){
				den.set('app1', 'ADMIN_EMAIL', 'bob@thebuilder.com', next);
			},
			function(next){
				den.set('app2', 'ADMIN_EMAIL', 'bob@thebuilder.com', next);
			},
			function(next){
				den.set('app3', 'ADMIN_EMAIL', 'bob@thebuilder.com', next);
			},
			function(next){
				den.ls(function(err, stacks){
					if(err){
						throw err;
					}

					stacks.length.should.equal(3);

					var hit = {};
					stacks.forEach(function(s){
						hit[s] = true;
					})

					hit.app1.should.equal(true);
					hit.app2.should.equal(true);
					hit.app3.should.equal(true);

					next();
				})
			}
		], done)
  })



  it('should remove a stack', function(done) {

  	this.timeout(2000);

		var den = make_denver();

		async.series([
			function(next){
				den.set('app1', 'ADMIN_EMAIL', 'bob@thebuilder.com', next);
			},
			function(next){
				den.set('app2', 'ADMIN_EMAIL', 'bob@thebuilder.com', next);
			},
			function(next){
				den.set('app3', 'ADMIN_EMAIL', 'bob@thebuilder.com', next);
			},
			function(next){
				den.rm('app2', next);
			},
			function(next){
				den.ls(function(err, stacks){
					if(err){
						throw err;
					}

					stacks.length.should.equal(2);

					var hit = {};
					stacks.forEach(function(s){
						hit[s] = true;
					})

					hit.app1.should.equal(true);
					hit.app3.should.equal(true);

					next();
				})
			}
		], done)
  })


  it('get the environment for a single stack', function(done) {

  	this.timeout(2000);

		var den = make_denver();

		async.series([
			function(next){
				den.set('app1', 'ADMIN_EMAIL', 'bob@thebuilder.com', next);
			},
			function(next){
				den.set('app1', 'OTHER_ENV', 'hello', next);
			},
			function(next){
				den.env('app1', function(err, vars){
					if(err){
						throw err;
					}

					vars.ADMIN_EMAIL.should.equal('bob@thebuilder.com');
					vars.OTHER_ENV.should.equal('hello');

					next();
				})
			}
		], done)
  })

  it('get the environment for a merged stack', function(done) {

  	this.timeout(2000);

		var den = make_denver();

		async.series([
			function(next){
				den.set('app1', 'ADMIN_EMAIL', 'bob@thebuilder.com', next);
			},
			function(next){
				den.set('app1', 'OTHER_ENV', 'hello', next);
			},
			function(next){
				den.set('app2', 'OTHER_ENV', 'hello2', next);
			},
			function(next){
				den.env(['app1', 'app2'], function(err, vars){
					if(err){
						throw err;
					}

					vars.ADMIN_EMAIL.should.equal('bob@thebuilder.com');
					vars.OTHER_ENV.should.equal('hello2');

					next();
				})
			}
		], done)
  })
	

})
