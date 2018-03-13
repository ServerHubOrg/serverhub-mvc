return {
    index: function (req, res, context, method) {
        return context;
    },
    primary: function (req, res, context, method) {
        context.name = 'Ziyuan';
        return context;
    }
};
