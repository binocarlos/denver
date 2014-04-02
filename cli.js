#!/usr/bin/env node
var program = require('commander');
var denver = require('./index');
var version = require('./package.json').version;
var concat = require('concat-stream');
var async = require('async');

function get_denver(){
	var settings = {
		host:process.env.DENVER_HOST || program.host || '127.0.0.1',
		port:process.env.DENVER_PORT || program.port || 4001,
		key:process.env.DENVER_KEY || program.key || '/denver'
	}

	var den = denver(settings);
	return den;
}

function get_stacks(command){
  var args = process.argv;
  var stacks = [];
  var commandhit = false;

  args.forEach(function(arg){
    if(commandhit){
      stacks.push(arg);
    }
    if(arg==command){
      commandhit = true;
    }
  })

  return stacks;
}

program
  .version(version)
  .option('-k, --key <string>', 'etcd port', '/denver')
  .option('-p, --port <port>', 'etcd port', '4001')
  .option('-h, --hostname <hostname>', 'etcd host', '127.0.0.1')
  .parse(process.argv);

program
  .command('get <stack> <key>')
  .description('read a value from a stack')
  .action(function(stack, key){

  	var den = get_denver();

  	den.get(stack, key, function(err, value){
  		if(value){
  			console.log(value);	
  		}
  	})
  	
  })

program
  .command('set <stack> <key> <value>')
  .description('write a value to a stack')
  .action(function(stack, key, value){

  	var den = get_denver();

  	den.set(stack, key, value, function(err){
  		if(err){
        console.error(err);
        process.exit(1);
      }
  	})
  	
  })

program
  .command('ls')
  .description('list the current stacks')
  .action(function(){

  	var den = get_denver();

  	den.ls(function(err, stacks){
  		if(err){
        console.error(err);
        process.exit(1);
      }
      if(stacks && stacks.length>0){
        console.log(stacks.join("\n"));  
      }
  	})
  	
  })


program
  .command('rm <stack>')
  .description('remove a stack')
  .action(function(stack){

    var den = get_denver();

    den.rm(stack, function(err){
      if(err){
        console.error(err);
        process.exit(1);
      }
    })
    
  })


program
  .command('env')
  .description('print the environment for some stacks')
  .action(function(){

    var stacks = get_stacks('env');    
    var den = get_denver();

    den.env(stacks, function(err, env){
      if(err){
        console.error(err);
        process.exit(1);
      }

      Object.keys(env || {}).forEach(function(key){
        console.log(key + '=' + env[key]);
      })
    })
    
  })


program
  .command('docker')
  .description('print the environment for some stacks in docker format')
  .action(function(){

    var stacks = get_stacks('docker');
    var den = get_denver();

    den.env(stacks, function(err, env){
      if(err){
        console.error(err);
        process.exit(1);
      }

      var st = Object.keys(env || {}).map(function(key){
        return '-e ' + key + '=' + env[key];
      }).join(' ');

      console.log(st);
    })
    
  })


program
  .command('inject <stack>')
  .description('inject new environment variables from a textfile')
  .action(function(stack){

    var stacks = get_stacks('docker');
    var den = get_denver();

    process.stdin.pipe(concat(function(inject){
      var values = inject.toString().split(/\r?\n/).map(function(line){
        return line.split('=');
      })

      async.forEach(values, function(arr, nextarr){
        
        if(arr[0]){
          den.set(stack, arr[0], arr[1], nextarr);  
        }
        else{
          nextarr();
        }
        
      }, function(err){
        if(err){
          console.error(err);
          process.exit(1);
        }
      })

    }))
    
  })

program
  .command('*')
  .action(function(command){
    console.log('denver version ' + version + ' - \'denver --help\' for more info');
  });

program.parse(process.argv);