import Validator, { FunctionDefinition } from "./base";
export default class PluginValidation extends Validator {
    protected RequiredFunctions: Array<FunctionDefinition>;
    Validate(m: Object): boolean;
    protected PassFunction(definition: FunctionDefinition): boolean;
}
