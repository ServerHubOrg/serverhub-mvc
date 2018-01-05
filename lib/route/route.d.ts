export declare class Route {
    private constructor();
    public MapRoute(routeName: string, routeRule: string, defaultValue: RouteValue): void;

    public IgnoreRoute(...routes: string[]): void;

    public RunRoute(path: string): RouteValue;

    public static GetRoute(): Route;
}

export declare interface RouteValue {
    Controller: string;
    Action: string;
    Id: string;
    Search?: string;
}