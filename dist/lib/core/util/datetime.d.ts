declare class DateTime {
    static readonly Now: Date;
    static GetDay(input?: string | number): string;
    static GetDayName(input?: string | number): string;
    static GetMonth(input?: string | number): string;
    static GetYear(input?: string | number): string;
    static GetFullYear(input?: string | number): string;
    static GetHours(input?: string | number): string;
    static GetMinutes(input?: string | number): string;
    static GetSeconds(input?: string | number): string;
    static GetMilliseconds(input?: string | number): string;
}
export { DateTime };
