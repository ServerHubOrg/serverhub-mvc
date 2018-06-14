export declare class Route {
    private static Instance;
    private Name;
    private Rule;
    private Default;
    private IgnoredRules;
    private RulePrefix;
    constructor();
    MapRoute(routeName: string, routeRule: string, defaultValue: RouteValue): void;
    IgnoreRoute(routes: (string | RegExp)[]): void;
    private ValidateRule(input);
    private Ignored(p);
    RunRoute(path: string): RouteValue;
    static GetRoute(): Route;
}
export interface RouteValue {
    Controller: string;
    Action: string;
    Id: string;
    Search?: string;
}
