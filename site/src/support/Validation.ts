export enum ValidationErrors {
    TOO_SHORT,
    CHAR_NOT_CONTAINED,
    NUMBER_NOT_CONTAINED,
}


export const validatePassword = (password: string): ValidationErrors[] => {
    const errors: ValidationErrors[] = [];
    if (password.length < 8) {
        errors.push(ValidationErrors.TOO_SHORT);
    }
    if (!/[a-zA-Z]/.test(password)) {
        errors.push(ValidationErrors.CHAR_NOT_CONTAINED);
    }
    if (!/\d/.test(password)) {
        errors.push(ValidationErrors.NUMBER_NOT_CONTAINED);
    }
    return errors;
}

export const replaceValue = (enumValue: ValidationErrors) =>{

    switch (enumValue){
        case ValidationErrors.TOO_SHORT:
            return "Password needs at least 8 characters"
        case ValidationErrors.CHAR_NOT_CONTAINED:
            return "Password must contain a character"
        case ValidationErrors.NUMBER_NOT_CONTAINED:
            return "Password must contain a number"
        default:
            return "Unknown error"
    }
}
