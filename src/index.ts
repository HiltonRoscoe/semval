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

for (const key in Object.keys(enumerations)) {
    if (enumerations.hasOwnProperty(key)) {
        oclEngine.registerEnums(key, enumerations[key]);
    }
}

// validate the top level object
// tslint:disable-next-line:forin
for (const prop in instToTest) {
    console.log(`testing ${prop}`);
    const validationErrors = oclEngine.evaluateInstance(instToTest[prop]);
    console.log(validationErrors.length > 0 ? JSON.stringify(validationErrors) : "good");
}
