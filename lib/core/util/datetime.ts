/**
 * Utils - Date
 * 
 * ServerHub MVC, MIT License
 * April 25, 2018
 * Yang Zhongdong (yangzd1996@outlook.com)
 */

function Generate_DayName(input?: string | number): string {
    let value = input || new Date().getDay();
    if (typeof value === 'string')
        value = parseInt(value);

    if (value < 1 || value > 7)
        value = 1;
    return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][value - 1];
}

function Generate_Day(input?: string | number): string {
    let value = input || new Date().getDate();
    if (typeof value === 'string')
        value = parseInt(value);

    if (value < 1 || value > 31)
        value = 1;

    if (value < 10)
        return '0' + value.toString();
    return value.toString();
}

function Generate_Month(input?: string | number): string {
    let value = input || new Date().getMonth();
    if (typeof value === 'string')
        value = parseInt(value);

    if (value < 0 || value > 11)
        value = 0;

    return ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][value];
}

function Generate_Year(input?: string | number): string {
    let value = input || new Date().getFullYear();
    if (typeof value === 'string')
        value = parseInt(value);

    if (value < 10 || value > 2999)
        value = 1970;
    if (value < 100)
        value = 1900 + value;
    if (value < 1000)
        return '0' + value.toString();
    return value.toString();
}

function Generate_Hours(input?: string | number): string {
    let value = input || new Date().getHours();
    if (typeof value === 'string')
        value = parseInt(value);
    if (value < 0 || value > 23)
        value = 0;

    if (value < 10)
        return '0' + value.toString();
    return value.toString();
}

function Generate_Minutes(input?: string | number): string {
    let value = input || new Date().getMinutes();
    if (typeof value === 'string')
        value = parseInt(value);
    if (value < 0 || value > 59)
        value = 0;

    if (value < 10)
        return '0' + value.toString();
    return value.toString();
}

function Generate_Seconds(input?: string | number): string {
    let value = input || new Date().getSeconds();
    if (typeof value === 'string')
        value = parseInt(value);
    if (value < 0 || value > 59)
        value = 0;

    if (value < 10)
        return '0' + value.toString();
    return value.toString();
}

function Generate_Milliseconds(input?: string | number): string {
    let value = input || new Date().getMilliseconds();
    if (typeof value === 'string')
        value = parseInt(value);
    if (value < 0 || value > 999)
        value = 0;

    if (value < 10)
        return '00' + value.toString();
    if (value < 100)
        return '0' + value.toString();
    return value.toString();
}



class DateTime {
    public static get Now() {
        return new Date();
    }
    public static GetDay(input?: string | number) {
        return Generate_Day(input);
    }
    public static GetDayName(input?: string | number) {
        return Generate_DayName(input);
    }
    public static GetMonth(input?: string | number) {
        return Generate_Month(input);
    }
    public static GetYear(input?: string | number) {
        return Generate_Year(input);
    }
    /**
     * Alias of DateTime.GetYear()
     */
    public static GetFullYear(input?: string | number) {
        return Generate_Year(input);
    }
    public static GetHours(input?: string | number) {
        return Generate_Hours(input);
    }
    public static GetMinutes(input?: string | number) {
        return Generate_Minutes(input);
    }
    public static GetSeconds(input?: string | number) {
        return Generate_Seconds(input);
    }
    public static GetMilliseconds(input?: string | number) {
        return Generate_Milliseconds(input);
    }
}

export { DateTime };