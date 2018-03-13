return {
    index: function (req, res, context) {
        count++;
        context.count = count;
        return context;
    }
}
