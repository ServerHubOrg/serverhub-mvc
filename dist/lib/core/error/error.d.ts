export declare class ErrorManager {
    static RenderError(errorEnum: CompileTimeError | RuntimeError, ...params: any[]): string;
    static RenderErrorAsHTML(error: Error): string;
}
export declare enum CompileTimeError {
    SH010101 = 65793,
    SH010102 = 65794,
    SH010103 = 65795,
    SH010201 = 66049,
}
export declare enum RuntimeError {
    SH020101 = 131329,
    SH020102 = 131330,
    SH020201 = 132353,
    SH020401 = 132097,
    SH020402 = 132098,
    SH020501 = 132353,
    SH020701 = 132865,
    SH020702 = 132866,
    SH020703 = 132867,
    SH020704 = 132868,
    SH020705 = 132869,
    SH020706 = 132870,
    SH020707 = 132871,
}
