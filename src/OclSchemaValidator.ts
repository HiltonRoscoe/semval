import each from "foreach";
import pointer from "json-pointer";
import { OclConstraint, OclConstraintError } from "./interfaces";
import { OclEngineFactory } from "./OclEngineFactory";

/**
 * Validates JSON instances based on rules embedded in a JSON Schema
 */
export class OclSchemaValidator {

    private oclEngine: any;

    constructor(constraints: OclConstraint[]) {
        this.oclEngine = OclEngineFactory.getOclEngine();
        // add constraints to Ocl Engine
        constraints.forEach((oclConstraint) => this.oclEngine.addOclExpression(oclConstraint.expression));
    }

    public evaluateInstance(jsonInstance: Object) {
        const validationResult = this.oclEngine.evaluate(jsonInstance);
        const validationErrors: OclConstraintError[] = [];
        if (!validationResult.result) {
            const currentValidationErrors = validationResult.namesOfFailedInvs.map((o) => {
                return { pointer: "/", invName: o };
            });
            validationErrors.push(...currentValidationErrors);
        }
        // code to walk a JSON instance, skipping properties that are non objects
        // and thus not targets of an OCL context.
        const oclWalk = function walk(obj: Object, iterator: (value: any, pointer: string) => void, descend?: any) {
            const refTokens: any[] = [];

            descend = descend || function(value: Object) {
                const type = Object.prototype.toString.call(value);
                return type === "[object Object]" || type === "[object Array]";
            };

            (function next(cur) {
                each(cur, function(value: object, key: string) {
                    refTokens.push(String(key));
                    if (descend(value)) {
                        iterator(value, pointer.compile(refTokens));
                        next(value);
                    }
                    refTokens.pop();
                });
            }(obj));
        };

        oclWalk(jsonInstance, (value, pointer) => {
            const validationResult = this.oclEngine.evaluate(value);
            if (!validationResult.result) {
                const currentValidationErrors = validationResult.namesOfFailedInvs.map((o) => {
                    return { pointer, invName: o };
                });
                validationErrors.push(...currentValidationErrors);
            }
        });
        return validationErrors;
    }
    public registerEnums(enumerationName: string, enumerationLiterals: object) {
        this.oclEngine.registerEnum(enumerationName, enumerationLiterals);
    }
}
