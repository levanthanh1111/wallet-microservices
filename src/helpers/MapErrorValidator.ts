import { ValidationError } from "class-validator-multi-lang";
import { FieldError } from "../interface/FieldError";


const MapErrorValidator = (validate: ValidationError[]): FieldError[] => {
    return validate.map((val: any) => {
        const message = Object.values(val.constraints as {
            [type: string]: string;
        })[0];
        return {
            field: val.property,
            message
        };
    });
};
export default MapErrorValidator;