import color from "colors/safe";
import program from "commander";
(global as any).window = undefined; // Needed to avoid exception at import..
import { IOclConstraint } from "./interfaces";
import { SemanticValidation } from "./SemanticValidation";
import prettyjson from "prettyjson";
// simplifies usage of test data
// tslint:disable:no-var-requires

// CLI UI stuff
program
    .version("0.1.0")
    .description("ocl ruleset runner for json")
    .arguments("<instance> <oclRules> [enums]")
    .option("-m, --multiple", "instance file contains multiple instances")
    .action((pInstance, pOclRules, pEnums, opts) => {
        const instToTest = (() => {
            const instances = require(pInstance);
            if (program.multiple) {
                return instances;
            } else {
                // downstream code expects name / value pairs
                return { "(unnamed)": instances };
            }
        })();
        // get in format to call semval
        const oclRules: IOclConstraint[] = (pOclRules && require(pOclRules));
        const enumerations = pEnums && require(pEnums);

        const failures = SemanticValidation.validateInstance(instToTest, oclRules, enumerations);

        // get all the invs that failed, only way we know they were used
        const failedInvs =
            failures.reduce((prev, curr) => {
                return prev.concat(curr);
            }).map((o) => o.invName);
        // get all the constraints that were untested
        const untestedCons = oclRules.filter((o) => failedInvs.indexOf(o.name) === -1).map((o) => o.name);

        console.log("Coverage");
        //console.log(JSON.stringify(failures));
        console.log(prettyjson.render((failedInvs));
        console.log(prettyjson.render(untestedCons, {dashColor: "red"}));
    });    
    if (process.argv.length > 2) {
        program.parse(process.argv);
    } else {
        program.help();
    }
    