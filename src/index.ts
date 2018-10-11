import color from "colors/safe";
import program from "commander";
(global as any).window = undefined; // Needed to avoid exception at import..
import { IOclConstraint, IOclConstraintError } from "./interfaces";
import { OclSchemaValidator } from "./OclSchemaValidator";
import { SemanticValidation } from "./SemanticValidation";
// simplifies uses test data
// tslint:disable:no-var-requires

// list of constraints, could be its own JSON file
const constraints: IOclConstraint[] = require("../testData/oclrules2.json");
const rules = constraints;
// CLI UI stuff
program
    .version("0.1.0")
    .description("ocl ruleset runner for json")
    .option("-o, --oclRules <s>", "ocl rule set")
    .option("-e, --enumerations <s>", "enumeration spec")
    .option("-i, --instance <s>", "json instance")
    .option("-m, --multiple", "instance file contains multiple instances")
    .parse(process.argv);
const instToTest = (() => {
    const instances = require(program.instance || "../testData/oclInstances.json");
    if (program.multiple) {
        return instances;
    } else {
        // downstream code expects name / value pairs
        return { "(unnamed)": instances };
    }
})();
// get in format to call semval
const oclRules = (program.oclRules && require(program.oclRules)) || constraints;
const enumerations = require(program.enumerations || "../testData/oclEnums.json");

const failures = SemanticValidation.validateInstance(instToTest, oclRules, enumerations);

// get all the invs that failed, only way we know they were used
const failedInvs =
    failures.reduce((prev, curr) => {
        return prev.concat(curr);
    }).map((o) => o.invName);
// get all the constraints that were untested
const untestedCons = constraints.filter((o) => failedInvs.indexOf(o.name) === -1).map((o) => o.name);
console.log("Coverage");
//console.log(JSON.stringify(failures));
console.log(color.green(`tested: ${JSON.stringify(failedInvs)}`));
console.log(color.red(`untested: ${JSON.stringify(untestedCons)}`));
