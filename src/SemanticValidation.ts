import { IOclConstraint } from "./interfaces";
import { OclSchemaValidator } from "./OclSchemaValidator";
import color from "colors/safe";

export class SemanticValidation {
    /**
     * 
     * @param jsonInstance instance to validate
     * @param oclRules a set of rules to apply to the instance
     * @param enumerations a optional set of enumerations
     */
    public static validateInstance(jsonInstance: any, oclRules: IOclConstraint[], enumerations?: any) {
        const oclEngine = new OclSchemaValidator(oclRules);

        for (const key in enumerations) {
            if (enumerations.hasOwnProperty(key)) {
                oclEngine.registerEnums(key, enumerations[key]);
            }
        }

        // validate the top level object
        // tslint:disable-next-line:forin
        const failures = [];
        for (const prop in jsonInstance) {
            if (jsonInstance.hasOwnProperty(prop)) {
                console.log(`testing ${prop}`);
                const validationErrors = oclEngine.evaluateInstance(jsonInstance[prop]);
                if (validationErrors.length > 0) {
                    console.log(color.red(JSON.stringify(validationErrors)));
                    failures.push(validationErrors);
                    // convention that prefixed (p) objects should pass
                    if (prop.startsWith("p")) {
                        console.log(color.rainbow("SHOULD PASS"));
                    }
                } else {
                    console.log(color.green("PASS"));
                }
            }
            // check for rule coverage. We want to make sure our set of rules are tested by
            //  the JSON instances
        }
        return failures;
    }
}
