abstract class IValidator {
    protected abstract PassFunction(Definition: FunctionDefinition): boolean;
    protected abstract RequiredFunctions: Array<FunctionDefinition>;
    public abstract Validate(target: Object): boolean;
}

interface FunctionDefinition {
    FunctionName: string;
    Required: boolean;
    ParamRequirement: Number;
}

export default IValidator;

export { FunctionDefinition };