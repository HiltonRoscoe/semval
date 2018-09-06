
(global as any).window = undefined; // Needed to avoid exception at import..
import OclEngine from "@stekoe/ocl.js";
import pointer from "json-pointer";
import each from "foreach";
const oclEngine = new OclEngine();
oclEngine.setTypeDeterminer((obj: any) => {
    // get ocl context name from JSON schema @type
    if (obj) {
        // remove the VRI. prefix. This will need to be handled better.
        let ctx = obj["@type"] != undefined ? obj["@type"].split(".")[1] : undefined;
        return ctx;
    }
});

interface OclConstraint {
    expression: string;
    errorMessage?: string;
}

interface OclConstraintError {
    pointer: string;
    invName: string;
};

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
// add constraints to Ocl Engine
constraints.forEach(oclConstraint => oclEngine.addOclExpression(oclConstraint.expression));

// example JSON payload
const jsonInstance = require("../testData/va_example_1.json");

//validate the top level object
const validationResult = oclEngine.evaluate(jsonInstance);
const validationErrors: OclConstraintError[] = [];
if (!validationResult.result) {
    const currentValidationErrors = validationResult.namesOfFailedInvs.map(o => {
        return { "pointer": "/", invName: o };
    });
    validationErrors.push(...currentValidationErrors);
}
// code to walk a JSON instance, skipping properties that are non objects 
// and thus not targets of an OCL context.
const oclWalk = function walk(obj: Object, iterator: (value: any, pointer: string) => void, descend?: any) {
    var refTokens: any[] = [];

    descend = descend || function (value: Object) {
        var type = Object.prototype.toString.call(value);
        return type === '[object Object]' || type === '[object Array]';
    };

    (function next(cur) {
        each(cur, function (value: object, key: string) {
            refTokens.push(String(key));
            if (descend(value)) {
                iterator(value, pointer.compile(refTokens));
                next(value);
            }
            refTokens.pop();
        });
    }(obj));
};

oclWalk(jsonInstance, function (value, pointer) {
    // console.log(`ptr: ${pointer}`);
    const validationResult = oclEngine.evaluate(value);
    //console.log(JSON.stringify(value));
    //console.log(JSON.stringify(validationResult));    
    if (!validationResult.result) {
        const currentValidationErrors = validationResult.namesOfFailedInvs.map(o => {
            return { "pointer": pointer, invName: o };
        });
        validationErrors.push(...currentValidationErrors);
    }
});

// report errors to the console
console.log(JSON.stringify(validationErrors));
