/**
 * Validation Support Library
 * 
 * ServerHub MVC, MIT License
 * March 13, 2018
 * Yang Zhongdong (yangzd1996@outlook.com)
 */

/**
 * All validators should extend Validator in order to provide consistent logic.
 */
abstract class Validator {
    /**
     * Check whether function exists and function parameters satisfy requirements.
     * @param Definition Primary definition that a function should provide.
     */
    protected abstract PassFunction(Definition: FunctionDefinition): boolean;

    /**
     * All possible functions that a custom interface should provide.
     */
    protected abstract RequiredFunctions: Array<FunctionDefinition>;

    /**
     * Call for validation process to check custom interface.
     * @param target The wrapped string function return value.
     */
    public abstract Validate(target: Object): boolean;
}

/**
 * Defines the primary of dynamic checking operations.
 */
interface FunctionDefinition {
    /**
     * Name of the function being checked.
     */
    FunctionName: string;

    /**
     * Whether to throw an error when function missing in the target.
     */
    Required: boolean;

    /**
     * Determines how many parameters should be passed to custom function interfaces.
     * Does not contain rest parameters and parameters with default value.
     */
    ParamRequirement: Number;
}

export default Validator;

export { FunctionDefinition };