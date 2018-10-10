# json-vri-validator

Demonstrates how NIST 1500 CDF JSON instances can be validated by the use of OCL invariants.

## Rationale

There are certain rules that cannot be expressed using a schema language alone.

OCL fills in this gap by providing a simple, implementation format independent language for expressing predicates.

This prototype shows how OCL rules embedded in the NIST 1500 models can be used to validate JSON instances.

### Mutual Exclusion (xor)

Mutual exclusivity describes a situation where either *X* must be true or *Y* must be true, but never at the same time.

#### Example

The [VRI model](https://github.com/usnistgov/VoterRecordsInterchange/blob/master/VRI_UML_Documentation.md) contains a class called `AdditionalInfo`.

The additional info in question can be expressed as text (via `StringValue`) or as binary data (via `FileValue`), but not both.

This rule can be expressed by the following OCL constraint:

```ocl
context VoterId inv: self.StringValue.oclIsUndefined() xor self.FileValue.oclIsUndefined()
```

### Implication

There is a common pattern used throughout NIST 1500 CDFs that allows a producer to specify a custom value if an enumeration does not contain a suitable value.

#### Example

The VRI specification contains a class called `ContactMethod`. The type of `ContactMethod` can be specified by its `Type` attribute. The value of `Type` may be `email`, `phone` or `other`. If the `Type` is `other`, then the actual value is expected in the `OtherType` attribute.

We need a rule that says that OtherType must be defined when Type = other:

```ocl
context ContactMethod inv: self.Type = ContactMethodType::other implies not self.OtherType.oclIsUndefined()
```

## Using the prototype

This prototype provides a command line interface to test a set of JSON instances against a set of OCL constraints.

```sh
jsonocl --oclRules rulefile.json --instance instanceFile.json
```

## How to run

1. Install node / npm.
2. Run `npm run build`
3. Run `npm run start`
