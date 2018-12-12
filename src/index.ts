import program from "commander";
(global as any).window = undefined; // Needed to avoid exception at import..
import { IOclConstraint } from "./interfaces";
import { SemanticValidation } from "./SemanticValidation";
import prettyjson from "prettyjson";
// simplifies usage of test data
// tslint:disable:no-var-requires

// CLI UI stuff
program
    .version("0.2.0")
    .description("ocl ruleset runner for json")
    .arguments("<instance> <oclRules> [enums]")
    .option("-m, --multiple", "instance file contains multiple instances")
    .option("-c, --coverage", "append coverage report")
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
        if (program.coverage) {
            const failedInvs = (() => {
                if (failures.some((o) => o.length > 0)) {
                    // get all the invs that failed, only way we know they were used
                    return failures.reduce((prev, curr) => {
                        return prev.concat(curr);
                    }, []).map((o) => o.invName);
                    // get all the constraints that were untested
                } else {
                    return [];
                }
            })()
            const untestedCons = oclRules.filter((o) => failedInvs.indexOf(o.name) === -1).map((o) => o.name);
            console.log("Coverage");
            // if an OCL invariant failed, we know it was covered by an instance
            console.log(prettyjson.render(failedInvs, { emptyArrayMsg: "No OCL constraints covered" }));
            // the ones that didn't work
            console.log(prettyjson.render(untestedCons, { emptyArrayMsg: "All OCL constraints covered", dashColor: "red" }));
        }
    });
if (process.argv.length > 2) {
    program.parse(process.argv);
} else {
    program.help();
}
