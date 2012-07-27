var child_process = require('child_process')
  , EventEmitter = require('events').EventEmitter
  , log = require('winston')

function Launcher(name, settings, app){
	this.name = name
	this.settings = settings
	this.app = app
}

Launcher.prototype = {
	__proto__: EventEmitter.prototype
	, launch: function(){
		var app = this.app
		var url = app.url
		var settings = this.settings
		if (settings.setup){
			var self = this
			settings.setup(app, function(){
				self.doLaunch(app, url)
			})
		}else{
			this.doLaunch(app, url)
		}
	}
	, doLaunch: function(){
		var app = this.app
		var url = app.url
		var settings = this.settings
		var process
		if (settings.exe){
			var args = [url]
			if (settings.args instanceof Array)
	            args = settings.args.concat(args)
	        else if (settings.args instanceof Function)
	            args = settings.args(app)
			process = child_process.spawn(settings.exe, args)
		}else if (settings.cmd){
			process = child_process.exec(settings.cmd)
		}
		this.process = process
	}
	, kill: function(sig){
		this.process.kill(sig)
	}
}

module.exports = Launcher