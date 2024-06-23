import {userService} from "../services/UserService.ts";

export enum ValidationErrors {
    TOO_SHORT,
    CHAR_NOT_CONTAINED,
    NUMBER_NOT_CONTAINED,
    TOO_LONG,
    ALREADY_IN_USE,
    USERNAME_TOO_SHORT,
    EMAIL_ALREADY_IN_USE ,
    EMAIL_NOT_VALID_PATTERN
}

export const validateEmail = (email:string):ValidationErrors[] => {
    
    console.log(email);
    if (!RegExp(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/).test(email)){
        console.log("email not valid")
        return [ValidationErrors.EMAIL_NOT_VALID_PATTERN];
    }
    return [];
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
    if(username.length > 20){
        errors.push(ValidationErrors.TOO_LONG);
        return errors;
    }

    if(username.length < 1){
        errors.push(ValidationErrors.USERNAME_TOO_SHORT);
        return errors;
    }
    const isValid = await userService.validateUsername(username); // TODO: check if user exists auth stuff

    if(!isValid){
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
        case ValidationErrors.EMAIL_ALREADY_IN_USE:
            return "Email is already in use"
        case ValidationErrors.EMAIL_NOT_VALID_PATTERN:
            return "Email is not valid"
        default:
            return "Unknown error"
    }
}
