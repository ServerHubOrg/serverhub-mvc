"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const error_1 = require("../core/error/error");
const ControllerRegexp = /^\/((?:(?:\.[a-z\d_-])|(?:[a-z]))[a-z\d_-][a-z\d_.-]+)/;
const ActionRegexp = /^\/((?:(?:[a-z_])|(?:[a-z]))[a-z\d_.-]+)/;
const IdRegexp = /^\/((?:\d+\.?\d*)|(?:0x[a-f\d]+)|(?:[01]+b)|(?:\d+e[+-]?\d+))$/i;
class Route {
    constructor() {
        this.Name = 'default';
        this.Rule = '/{controller}/{action}/{id}';
        this.Default = {
            Controller: 'home',
            Action: 'index',
            Id: ''
        };
        this.IgnoredRules = new Array(0);
    }
    MapRoute(routeName, routeRule, defaultValue) {
        this.Name = routeName;
        if (!routeRule.startsWith('/'))
            routeRule = '/' + routeRule;
        if (!this.ValidateRule(routeRule)) {
            this.Rule = routeRule;
            this.RulePrefix = routeRule.slice(0, routeRule.indexOf('/{controller}'));
        }
        this.Rule = routeRule;
        this.Default = {
            Controller: (defaultValue && defaultValue.Controller) ? defaultValue.Controller : 'home',
            Action: (defaultValue && defaultValue.Action) ? defaultValue.Action : 'index',
            Id: (defaultValue && defaultValue.Id) ? defaultValue.Id : ''
        };
    }
    IgnoreRoute(routes) {
        let rs = [];
        if (!(routes instanceof Array))
            rs.push(routes);
        else
            rs = routes;
        rs.forEach((route) => {
            if (typeof route === 'string') {
                if (route.length > 0 && route.startsWith('/')) {
                    if (!route.endsWith('/'))
                        route += '/';
                    this.IgnoredRules.push(route);
                }
                else
                    this.IgnoredRules.push('/' + route);
            }
            else if (route instanceof RegExp) {
                this.IgnoredRules.push(route);
            }
            else
                throw new Error('Should be either string or RegExp object.');
        });
    }
    ValidateRule(input) {
        if (!input.includes('/{controller}/{action}'))
            throw new Error(error_1.ErrorManager.RenderError(error_1.CompileTimeError.SH010201, input, 'controller and action fields are required'));
        if (!input.match(/^[a-z\d._{}\/-]+$/i))
            throw new Error(error_1.ErrorManager.RenderError(error_1.CompileTimeError.SH010201, input, 'there are some invalid characters.'));
        if (!input.endsWith('}/') && !input.endsWith('}'))
            throw new Error(error_1.ErrorManager.RenderError(error_1.CompileTimeError.SH010201, input, 'invalid rule ending'));
        return true;
    }
    Ignored(p) {
        if (!p)
            return true;
        if (!p.endsWith('/'))
            p += '/';
        if (!p.startsWith('/'))
            p = '/' + p;
        let ignored = false;
        this.IgnoredRules.forEach(rule => {
            if (ignored)
                return;
            if (typeof rule === 'string') {
                if (rule.indexOf(p) === 0)
                    ignored = true;
            }
            else if (rule.test(p) === true) {
                ignored = true;
            }
        });
        return ignored;
    }
    RunRoutev1(path) {
        if (!path)
            path = '';
        if (path.startsWith('/'))
            path = path.substr(1);
        let searchMatch = path.match(/\/?(\?.*)$/);
        let search = '';
        if (searchMatch) {
            search = searchMatch[1];
            path = path.substr(0, path.indexOf(search) - 1);
        }
        if (path.length === 0) {
            return {
                Controller: this.Default.Controller,
                Action: this.Default.Action,
                Id: this.Default.Id,
                Search: search || ''
            };
        }
        if (this.Ignored(path))
            return void 0;
        if (path.match(/\/\/+$/))
            return void 0;
        let endsWithSlash = path.endsWith('/');
        let check = path.split('/');
        if (check && check.length === this.Rule.split('/').length - 1) {
            if (!endsWithSlash && !check[1].endsWith('/'))
                path = path + '/';
        }
        let regstr_controller = '([a-z][a-z\\d_\.\-]{0,30}[a-z\\d_])';
        let regstr_action = '([a-z][a-z\\d_\.\-]{0,30}[a-z\\d_])?';
        let regstr_id = '([^\\\\/*?:"<>|\\n]{0,128})';
        let reg_str = this.Rule.replace(/\//g, '\\/').replace('{controller}', regstr_controller);
        reg_str = reg_str.replace('{action}', regstr_action);
        reg_str = '^' + reg_str.replace('{id}', regstr_id) + '$';
        let regexp = new RegExp(reg_str);
        let match = path.match(regexp);
        if (match === null) {
            path += '/';
            match = path.match(regexp);
            if (match === null)
                return void 0;
        }
        let result;
        result = {
            Controller: match[1],
            Action: match[2] || this.Default.Action,
            Id: match[2] ? (match[3] || this.Default.Id) : this.Default.Id,
            Search: search || match[4] || ''
        };
        return result;
    }
    RunRoute(path) {
        if (!path || path.length === 0)
            path = '/';
        else if (!path.startsWith('/'))
            path = '/' + path;
        if (path.startsWith(this.RulePrefix))
            path = path.replace(this.RulePrefix, '');
        else if (this.RulePrefix && path !== '/')
            return void 0;
        let params = null;
        if (path.includes('?')) {
            let temp = {};
            try {
                let paramstr = path.slice(path.indexOf('?') + 1);
                paramstr.split('&').forEach(ele => {
                    let key = ele.slice(0, ele.indexOf('='));
                    let value = ele.slice(ele.indexOf('=') + 1);
                    Object.defineProperty(temp, key, { value: value, writable: false });
                });
            }
            catch (err) { }
            params = temp;
            path = path.slice(0, path.indexOf('?'));
        }
        let result = {};
        result.Search = params;
        let ctrlr_match = path.match(ControllerRegexp);
        if (!ctrlr_match || ctrlr_match.length !== 2) {
            if (path === '/') {
                result = {
                    Controller: this.Default.Controller,
                    Action: this.Default.Action,
                    Id: this.Default.Id,
                    Search: params
                };
            }
            else
                return void 0;
        }
        else {
            result.Controller = ctrlr_match[1];
            path = path.replace('/' + result.Controller, '');
        }
        let act_match = path.match(ActionRegexp);
        if (!act_match || act_match.length !== 2) {
            result.Action = this.Default.Action;
        }
        else {
            result.Action = act_match[1];
            path = path.replace('/' + result.Action, '');
        }
        let id_match = path.match(IdRegexp);
        if (!id_match || id_match.length !== 2) {
            result.Id = this.Default.Id;
        }
        else {
            result.Id = id_match[1];
        }
        return result;
    }
    static GetRoute() {
        return Route.Instance;
    }
}
Route.Instance = new Route();
exports.Route = Route;
;
