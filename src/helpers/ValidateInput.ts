import CustomResponse from "../dataTypes/response/CustomResponse";
import CustomRequest from "../dataTypes/request/CustomRequest";
import { Validator } from "class-validator-multi-lang";
import MapErrorValidator from "./MapErrorValidator";

const ValidateInput = async <T>(
    req: CustomRequest,
    input: any,
    message: any,
    showError: boolean = false
): Promise<CustomResponse<T> | null> => {
    const validation = await new Validator().validate(input, {
        messages: req.languageFile
    });
    if (validation.length > 0)
        return {
            code: 400,
            message,
            success: false,
            errors: showError ? MapErrorValidator(validation) : undefined
        };
    return null;
};
export default ValidateInput;
