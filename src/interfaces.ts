export interface IOclConstraint {
    name: string;
    expression: string;
    errorMessage?: string;
}

export interface IOclConstraintError {
    pointer: string;
    invName: string;
}
