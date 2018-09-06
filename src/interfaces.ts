export interface OclConstraint {
    expression: string;
    errorMessage?: string;
}

export interface OclConstraintError {
    pointer: string;
    invName: string;
};
