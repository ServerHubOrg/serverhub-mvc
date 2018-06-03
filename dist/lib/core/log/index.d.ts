import Access from "./log_access";
import Runtime from "./log_runtime";
import Error from "./log_error";
declare class LogService {
    static Start(): void;
}
export { Access as LogAccess, Runtime as LogRuntime, Error as LogError, LogService };
