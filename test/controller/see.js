(function() {
    var count = 0;
    return {
        index: function(req, res, context) {
            count++;
            context.count = count;
            return context;
        }
    }
})()