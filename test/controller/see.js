return {
	index: function(req, res, method) {
		return this.View();
	},
	tick: function(req, res, method) {
		res.setHeader('Content-Type', 'application/json');
		res.write({
			time: new Date().getTime()
		});
	}
}