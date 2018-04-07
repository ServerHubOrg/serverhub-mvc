interface HTTPRange {
    start: number;
    end: number;
}
declare function RangeParser(range: string, fileLength: number): Array<HTTPRange>;
export default RangeParser;
export { HTTPRange };
