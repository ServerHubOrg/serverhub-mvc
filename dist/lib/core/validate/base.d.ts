declare abstract class Validator {
    protected abstract PassFunction(Definition: FunctionDefinition): boolean;
    protected abstract RequiredFunctions: Array<FunctionDefinition>;
    abstract Validate(target: Object): boolean;
}
interface FunctionDefinition {
    FunctionName: string;
    Required: boolean;
    ParamRequirement: Number;
}
export default Validator;
export { FunctionDefinition };
