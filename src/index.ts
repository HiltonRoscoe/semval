import color from "colors/safe";
import program from "commander";
(global as any).window = undefined; // Needed to avoid exception at import..
import { OclConstraint, OclConstraintError } from "./interfaces";
import { OclSchemaValidator } from "./OclSchemaValidator";
// tslint:disable:no-var-requires

// list of constraints, could be its own JSON file
const constraints: OclConstraint[] = require("../testData/oclrules2.json");
const rules = constraints;
// CLI UI stuff
program
    .version("0.1.0")
    .description("OCL ruleset runner for JSON")
    .option("-o, --oclRules <s>", "OCL rule set")
    .option("-e, --enumerations <s>", "Enumeration spec")
    .option("-i, --instance <s>", "JSON Instance")
    .parse(process.argv);
const instToTest = require(program.instance || "../testData/oclInstances.json");
const oclEngine = new OclSchemaValidator((program.oclRules && require(program.oclRules)) || constraints);
const enumerations = require(program.enumerations || "../testData/oclEnums.json");

for (const key in enumerations) {
    if (enumerations.hasOwnProperty(key)) {
        oclEngine.registerEnums(key, enumerations[key]);
    }
}

// validate the top level object
// tslint:disable-next-line:forin
const failures = [];
for (const prop in instToTest) {
    if (instToTest.hasOwnProperty(prop)) {
        console.log(`testing ${prop}`);
        const validationErrors = oclEngine.evaluateInstance(instToTest[prop]);
        if (validationErrors.length > 0) {
            console.log(color.red(JSON.stringify(validationErrors)));
            failures.push(validationErrors);
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
// get all the invs that failed, only way we know they were used
const failedInvs =
    failures.reduce((prev, curr) => {
        return prev.concat(curr);
    }).map((o) => o.invName);
// get all the constraints that were untested
const untestedCons = constraints.filter((o) => failedInvs.indexOf(o.name) === -1).map((o) => o.name);

console.log(JSON.stringify(failures));
console.log(JSON.stringify(failedInvs));
console.log(JSON.stringify(untestedCons));
