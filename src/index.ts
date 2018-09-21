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
    .option("-o, --oclRules <s>", "OCL rule set")
    .option("-i --instance <s>", "JSON Instance")
    .parse(process.argv);
const instToTest = require("../testData/oclInstances.json");
// use example JSON payload if none provided
const jsonInstance = require(program.instance || "../testData/va_example_1.json");

const oclEngine = new OclSchemaValidator((program.oclRules && require(program.oclRules)) || constraints);
const enumerations = require("../testData/oclEnums.json");

for (const key in Object.keys(enumerations)) {
    oclEngine.registerEnums(key, enumerations[key]);
}

// validate the top level object
// tslint:disable-next-line:forin
for (const prop in instToTest) {
    console.log(`testing ${prop}`);
    const validationErrors = oclEngine.evaluateInstance(instToTest[prop]);
    console.log(validationErrors.length > 0 ? JSON.stringify(validationErrors) : "good");
}
