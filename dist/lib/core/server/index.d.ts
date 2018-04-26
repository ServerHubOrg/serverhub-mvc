import { Headers, IsValidHeaders, IsValidHeader, GetReasonMessage, TransformHeader, FormatDate } from "./head";
declare const Head: {
    IsValidHeaders: typeof IsValidHeaders;
    IsValidHeader: typeof IsValidHeader;
    GetReasonMessage: typeof GetReasonMessage;
    TransformHeader: typeof TransformHeader;
    FormatDate: typeof FormatDate;
};
export { Head, Headers };
