import { expect } from "chai";
import { SemanticValidation } from "../src/SemanticValidation";
// -------------------------------------------------------------------------
// Setup
// -------------------------------------------------------------------------

// -------------------------------------------------------------------------
// Specifications: common decorators
// -------------------------------------------------------------------------
// tslint:disable:only-arrow-functions
describe("semantic validation", async function () {
    it("should validate ocl constraint against non-passing instance", async function () {
        const jsonInstance =
        {
            "fTest": {
                "@type": "VRI.AdditionalInfo",
                "Name": "AdditionalInfoName",
                "StringValue": "123456",
                "FileValue": {
                    "@type": "VRI.File"
                }
            }
        };

        const rules = [{
            "name": "AiMustChooseOne",
            "errorMessage": "FileValue or StringValue must be defined (but not both)",
            "expression": "context AdditionalInfo inv AiMustChooseOne: not self.StringValue.oclIsUndefined() xor not self.FileValue.oclIsUndefined()"
        }];

        const validationResult = SemanticValidation.validateInstance(jsonInstance, rules);
        console.log(JSON.stringify(validationResult));
        expect(validationResult).to.deep.equal([[{ "pointer": "/", "invName": "AiMustChooseOne" }]]);
    });
    it("should validate ocl constraint using MOF enum", async function () {
        const jsonInstance =
        {
            "fVoterClassification": {
                "@type": "VRI.VoterClassification",
                "OtherType": "otherValue"
            }
        };
        const enums = {
            "VoterClassificationType": {
                "activatednationalguard": "activated-national-guard",
                "activeduty": "active-duty",
                "activedutyspouseordependent": "active-duty-spouse-or-dependent",
                "citizenabroadintenttoreturn": "citizen-abroad-intent-to-return",
                "citizenabroadreturnuncertain": "citizen-abroad-return-uncertain",
                "citizenabroadneverresided": "citizen-abroad-never-resided",
                "deceased": "deceased",
                "declaredincompetent": "declared-incompetent",
                "eighteenonelectionday": "eighteen-on-election-day",
                "felon": "felon",
                "permanentlydenied": "permanently-denied",
                "protectedvoter": "protected-voter",
                "restoredfelon": "restored-felon",
                "unitedstatescitizen": "united-states-citizen",
                "other": "other"
            }
        };

        const rules = [{
            "name": "OtherTypeMustBeDefinedTransitive",
            "errorMessage": "When OtherType is defined, Type must be other",
            "expression": "context VoterClassification inv OtherTypeMustBeDefinedTransitive: not self.OtherType.oclIsUndefined() implies self.Type = VoterClassificationType::other"
        }];

        const validationResult = SemanticValidation.validateInstance(jsonInstance, rules, enums);
        console.log(JSON.stringify(validationResult));
        expect(validationResult).to.deep.equal([[{ "pointer": "/", "invName": "OtherTypeMustBeDefinedTransitive" }]]);
    });
});
