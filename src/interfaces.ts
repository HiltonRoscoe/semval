export interface OclConstraint {
    name: string;
    expression: string;
    errorMessage?: string;
}

export interface OclConstraintError {
    pointer: string;
    invName: string;
}
