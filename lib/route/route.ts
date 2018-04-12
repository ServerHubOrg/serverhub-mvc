/**
 * Route Entry
 * 
 * ServerHub MVC, MIT License
 * March 13, 2018
 * Yang Zhongdong (yangzd1996@outlook.com)
 */

/**
 * Route static class provide operations such as map a new route or ignore a specific one.
 */
export class Route {
    private static Instance = new Route();
    private Name: string;
    private Rule: string;
    private Default: RouteValue;
    private IgnoredRules: Array<string | RegExp>;
    constructor() {
        this.Name = 'default';
        this.Rule = '{controller}/{action}/{id}';
        this.Default = {
            Controller: 'home',
            Action: 'index',
            Id: ''
        };
        this.IgnoredRules = new Array<string>(0);
    }

    public MapRoute(routeName: string, routeRule: string, defaultValue: RouteValue) {
        this.Name = routeName;
        this.Rule = routeRule;
        this.Default = {
            Controller: (defaultValue && defaultValue.Controller) ? defaultValue.Controller : 'home',
            Action: (defaultValue && defaultValue.Action) ? defaultValue.Action : 'index',
            Id: (defaultValue && defaultValue.Id) ? defaultValue.Id : ''
        } as RouteValue;
    }

    public IgnoreRoute(routes: (string | RegExp)[]) {
        let rs = [];
        if (!(routes instanceof Array))
            rs.push(routes);
        else rs = routes;
        rs.forEach((route: string | RegExp) => {
            if (typeof route === 'string') {
                // must start with '/'
                if (route && route.startsWith('/')) {
                    if (!route.endsWith('/'))
                        route += '/';
                    this.IgnoredRules.push(route);
                }
            } else if (route instanceof RegExp) {
                this.IgnoredRules.push(route);
            }
            else throw new Error('Should be either string or RegExp object.');
        });
    }

    private Ignored(p: string) {
        if (!p.endsWith('/'))
            p += '/';
        if (!p.startsWith('/'))
            p = '/' + p;
        let ignored = false;
        if (!ignored && this.IgnoredRules)
            this.IgnoredRules.forEach(rule => {
                if (ignored) return;
                if (typeof rule === 'string') {
                    if (rule.indexOf(p) === 0)
                        ignored = true;
                }
                else if ((rule as RegExp).test(p) === true) {
                    ignored = true;
                }
            })
        return ignored;
    }

    public RunRoute(path: string): RouteValue {
        if (!path)
            path = '';
        if (path.startsWith('/'))
            path = path.substr(1);
        if (path.length === 0) {
            return {
                Controller: this.Default.Controller,
                Action: this.Default.Action,
                Id: this.Default.Id,
                Search: ''
            } as RouteValue;
        }

        if (this.Ignored(path))
            return void 0;

        let check = path.split('/');
        if (check && check.length === 2) {
            if (!check[1].endsWith('/'))
                path = path + '/';
        }

        let regstr_controller = '([a-z\\d_]{1,32})';
        let regstr_action = '([a-z\\d_]{0,32})';
        let regstr_id = '([^\\\\/*?:"<>|\\n]{0,128})';
        let reg_str = this.Rule.replace(/\//g, '\\/').replace('{controller}', regstr_controller);

        reg_str = reg_str.replace('{action}', regstr_action);
        reg_str = '^' + reg_str.replace('{id}', regstr_id) + '\\/?(\\?.*)?$';

        let regexp = new RegExp(reg_str);
        let match = path.match(regexp);
        if (match === null) {
            path += '/';
            match = path.match(regexp);
            if (match === null)
                return void 0;
        }
        let result: RouteValue;
        result = {
            Controller: match[1] ? match[1] : this.Default.Controller,
            Action: match[2] ? match[2] : this.Default.Action,
            Id: match[3] ? match[3] : this.Default.Id,
            Search: match[4] ? match[4] : ''
        } as RouteValue;
        return result;
    }

    public static GetRoute(): Route {
        return Route.Instance;
    }
}

export interface RouteValue {
    Controller: string;
    Action: string;
    Id: string;
    Search?: string;
};