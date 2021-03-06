const each = require("foreach");
import jsonPointer from "json-pointer";
import { IOclConstraint, IOclConstraintError } from "./interfaces";
import { OclEngineFactory } from "./OclEngineFactory";

/**
 * Validates JSON instances based on rules embedded in a JSON Schema
 */
export class OclSchemaValidator {

    private oclEngine: any;

    constructor(constraints: IOclConstraint[]) {
        this.oclEngine = OclEngineFactory.getOclEngine();
        // add constraints to Ocl Engine
        constraints.forEach((oclConstraint) => this.oclEngine.addOclExpression(oclConstraint.expression));
    }

    public evaluateInstance(jsonInstance: object) {
        const validationResult = this.oclEngine.evaluate(jsonInstance);
        const validationErrors: IOclConstraintError[] = [];
        if (!validationResult.result) {
            const currentValidationErrors = validationResult.namesOfFailedInvs.map((o: any) => {
                return { pointer: "/", invName: o };
            });
            validationErrors.push(...currentValidationErrors);
        }
        // code to walk a JSON instance, skipping properties that are non objects
        // and thus not targets of an OCL context.
        const oclWalk = function walk(obj: object, iterator: (value: any, pointer: string) => void, descend?: any) {
            const refTokens: any[] = [];

            descend = descend || function (value: object) {
                const type = Object.prototype.toString.call(value);
                return type === "[object Object]" || type === "[object Array]";
            };

            (function next(cur) {
                each(cur, function (value: object, key: string) {
                    refTokens.push(String(key));
                    if (descend(value)) {
                        iterator(value, jsonPointer.compile(refTokens));
                        next(value);
                    }
                    refTokens.pop();
                });
            }(obj));
        };

        oclWalk(jsonInstance, (value: object, pointer: any) => {
            const currentValidationResult = this.oclEngine.evaluate(value);
            if (!currentValidationResult.result) {
                const currentValidationErrors = currentValidationResult.namesOfFailedInvs.map((o: any) => {
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
