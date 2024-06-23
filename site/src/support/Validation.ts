import {userService} from "../services/UserService.ts";

export enum ValidationErrors {
    TOO_SHORT,
    CHAR_NOT_CONTAINED,
    NUMBER_NOT_CONTAINED,
    TOO_LONG,
    ALREADY_IN_USE,
    USERNAME_TOO_SHORT
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

export const validateUsername = async (username: string)=>{
    const errors: ValidationErrors[] = [];
    const user = await userService.getUser(username); // TODO: check if user exists auth stuff
    if(username.length === 20){
        errors.push(ValidationErrors.TOO_LONG);
    }

    if(username.length < 1){
        errors.push(ValidationErrors.USERNAME_TOO_SHORT);
    }

    if(user){
        errors.push(ValidationErrors.ALREADY_IN_USE);
    }

    return errors;
}

export const replaceValue = (enumValue: ValidationErrors) =>{

    switch (enumValue){
        case ValidationErrors.TOO_SHORT:
            return "Password needs at least 8 characters"
        case ValidationErrors.USERNAME_TOO_SHORT:
            return "Username is too short (at least a character needed)"
        case ValidationErrors.CHAR_NOT_CONTAINED:
            return "Password must contain a character"
        case ValidationErrors.NUMBER_NOT_CONTAINED:
            return "Password must contain a number"
        case ValidationErrors.TOO_LONG:
            return "Username is too long (max. 20 chars)"
        case ValidationErrors.ALREADY_IN_USE:
            return "Username is already in use/chose another name"
        default:
            return "Unknown error"
    }
}
