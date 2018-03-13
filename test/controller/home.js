return {
    index: function (req, res, context, method) {
        return context;
        // return 'Ziyuan, my love';
    },
    primary: function (req, res, context, method) {
        context.name = 'Ziyuan';
        return context;
    }
};
