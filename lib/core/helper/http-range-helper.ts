/**
 * Range Service
 * ServerHub Service Libraries
 * Yang Zhongdong, 2018-4-3
 */

/**
 * Detailed information can be found on repository ServerHub-Service.
 */

/**
 * Provide range structure for HTTP headers.
 */
interface HTTPRange {
    start: number;
    end: number;
}

/**
 * Parse range string to a normalized one.
 * @param {string} range Raw HTTP range string
 */
function RangeParser(range: string, fileLength: number): Array<HTTPRange> {
    let rangeTester = /^bytes=((?:(\d*-\d+)|(?:,\s?)|(\d+-\d*))+)$/;
    let match = range.match(rangeTester);
    if (match === null || match === void 0)
        throw new Error('Range Not Satisfiable');
    else {
        let rangeGroup = match[1];
        let oriRanges = rangeGroup.split(/,\s?/);
        let ranges = new Array<HTTPRange>(0);
        oriRanges.map(r => {
            if (r.length === 0)
                return;
            let segs = r.split('-');
            let newRange = null;
            if (segs[0] === '' && segs[1] !== '') {
                let lastCount = parseInt(segs[1]);
                if (lastCount <= fileLength) {
                    newRange = {
                        start: fileLength - lastCount,
                        end: fileLength - 1
                    };
                } else throw new Error('Range Not Satisfiable');
            } else if (segs[1] === '' && segs[0] !== '') {
                newRange = {
                    start: parseInt(segs[0]),
                    end: fileLength
                };
            } else if (segs.indexOf('') === -1) {
                let start = parseInt(segs[0]);
                let end = parseInt(segs[1]);
                newRange = {
                    start: start,
                    end: end
                } as HTTPRange;
            }

            if (ranges.length !== 0) {
                ranges = MixN(newRange, ranges);
            } else ranges = [newRange];
        });
        return ranges;
    }
}

function Mix2(rangeA: HTTPRange, rangeB: HTTPRange): Array<HTTPRange> {
    if (rangeA.end < rangeB.start) {
        return [rangeA, rangeB];
    }

    if (rangeA.end === rangeB.start) {
        return [{
            start: rangeA.start,
            end: rangeB.end
        }];
    }

    if (rangeA.start < rangeB.start && rangeB.start < rangeA.end && rangeA.end < rangeB.end)
        return [{
            start: rangeA.start,
            end: rangeB.end
        }];

    if (rangeB.start < rangeA.start && rangeA.start < rangeB.end && rangeB.end < rangeA.end)
        return [{
            start: rangeB.start,
            end: rangeA.end
        }];

    if (rangeB.end < rangeA.start) {
        return [rangeB, rangeA];
    }
    if (rangeB.end === rangeA.start) {
        return [{
            start: rangeB.start,
            end: rangeA.end
        }];
    }
}

function MixN(newRange: HTTPRange, oriRanges: Array<HTTPRange>): Array<HTTPRange> {
    if (!Array.isArray(oriRanges))
        throw new Error('Second parameter must be an array.')

    if (oriRanges.length === 0)
        return [newRange];
    let range = oriRanges[0];
    let intersected = (range.end >= newRange.start && range.end <= newRange.end) || (range.start <= newRange.end && range.end >= newRange.end);
    if (intersected) {
        let mergedRange = Mix2(newRange, range)[0]; // must be array with only one element.
        return MixN(mergedRange, oriRanges.slice(1));
    }
    if (range.start > newRange.end) {
        return [newRange].concat(oriRanges);
    }
    if (range.end < newRange.start) {
        return [range].concat(MixN(newRange, oriRanges.slice(1)));
    }
}


export default RangeParser;
export { HTTPRange };