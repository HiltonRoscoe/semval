# semval

Demonstrates how NIST 1500 CDF JSON instances can be validated by the use of OCL invariants.

<!-- TOC -->

- [semval](#semval)
    - [Rationale](#rationale)
        - [Mutual Exclusion (xor)](#mutual-exclusion-xor)
            - [Example](#example)
        - [Implication](#implication)
            - [Example](#example-1)
    - [Acquiring the prototype](#acquiring-the-prototype)
    - [Using the prototype](#using-the-prototype)
        - [Creating your own rulesets](#creating-your-own-rulesets)
        - [Testing a set of instances](#testing-a-set-of-instances)
    - [How to run (from source)](#how-to-run-from-source)

<!-- /TOC -->

## Rationale

There are certain rules that cannot be expressed using a schema language alone.

OCL fills in this gap by providing a simple, implementation format independent language for expressing predicates.

This prototype shows how OCL rules embedded in the NIST 1500 models can be used to validate JSON instances.

### Mutual Exclusion (xor)

Mutual exclusivity describes a situation where either *X* must be true or *Y* must be true, but never at the same time.

#### Example

The [VRI model](https://github.com/usnistgov/VoterRecordsInterchange/blob/master/VRI_UML_Documentation.md) contains a class called `AdditionalInfo`.

The additional info in question can be expressed as text (via `StringValue`) or as binary data (via `FileValue`), but not both.

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

Contrariwise, we should have a rule that ensures OtherType is defined only when Type = other:

```ocl
context ContactMethod inv: not self.OtherType.oclIsUndefined() implies ContactMethodType::other
```

## Acquiring the prototype

This prototype is available via [node package manager (NPM)](https://www.npmjs.com/package/semval).

```sh
npm i semval
```

## Using the prototype

This prototype provides a command line interface to test a set of JSON instances against a set of OCL constraints.

```sh
Usage: semval [options] <instance> <oclRules> [enums]

ocl ruleset runner for json

Options:
  -V, --version   output the version number
  -m, --multiple  instance file contains multiple instances
  -h, --help      output usage information
```

### Creating your own rulesets

Rulesets are specified as JSON in the following format:

```typescript
[
    {
        name: string;
        errorMessage: string;
        expression: string;
    }
    ...
]
```

The validator uses the [https://github.com/SteKoe/ocl.js](ocl.js) engine to validate instances against OCL invariants. Please view its documentation for notes regarding OCL support and usage.

### Testing a set of instances

using the `--multiple` flag will allow you to test a set of JSON instances in a single file. The file must be in the form of:

```typescript
{
    "instance_name": object,
    ...
}
```

## How to run (from source)

1. Install node / npm.
2. Run `npm run build`
3. Run `npm run start`
