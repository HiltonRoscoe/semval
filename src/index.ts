import program from "commander";
(global as any).window = undefined; // Needed to avoid exception at import..
import { OclConstraint, OclConstraintError } from "./interfaces";
import { OclSchemaValidator } from "./OclSchemaValidator";

// list of constraints, could be its own JSON file
const constraints: OclConstraint[] = [
    {
        expression: `context AdditionalInfo 
            inv AiMustChooseOne: self.StringValue->oclIsUndefined() xor self.FileValue->oclIsUndefined()`,
        errorMessage: "FileValue or StringValue must be defined (but not both)"
    },
    {
        expression: `context VoterId 
            inv ViOtherTypeMustBeDefined: self.Type <> "other" implies self.OtherType->oclIsUndefined()`,
        errorMessage: "OtherType must be defined when Type = other"
    },
    {
        expression: `context VoterRecordsRequest
        inv IssuerRequired: self.Issuer->size() > 0`,
        errorMessage: "An issuer must be specified"
    },
    {
        expression: `context VoterRecordsRequest
        inv OnlyBallots: self.Type->exists(c | c = "ballot-request")
            and self.Type->size() = 1`,
        errorMessage: `There may be only one Type, and it must be set to "ballot-request"`
    },
    {
        expression: `context VoterRecordsRequest
        inv VaForm: self.Form = "other" implies
            self.OtherForm = "SBE-701" or self.OtherForm = "SBE-703.1"`,
        errorMessage: `There form must be a known type`
    },
    {
        expression: `context Voter
            inv ssnRequired: self.VoterId->exists(c | self.Type = "ssn" or self.Type = "ssn4")`,
        errorMessage: `ssn4 or full ssn is required`
    },
    {
        expression: `context VoterId
            inv voterIdString: StringValue->size() > 0`,
        errorMessage: `There form must be a known type`
    }

];

// CLI UI stuff
program
    .version("0.1.0")
    .option("-o, --oclRules <s>", "OCL rule set")
    .option("-i --instance <s>", "JSON Instance")
    .parse(process.argv);


// use example JSON payload if none provided
const jsonInstance = require(program.oclRules || "../testData/va_example_1.json");
const oclEngine = new OclSchemaValidator((program.oclRules && require(program.oclRules)) || constraints);
//validate the top level object
const validationErrors = oclEngine.evaluateInstance(jsonInstance);

// report errors to the console
console.log(JSON.stringify(validationErrors));
