import { FieldError } from "../../interface/FieldError";
import { Pagination } from "../../modules/requestTransfer/interfaces/InterfaceResponse";

export default interface CustomResponse<T = {}> {
    code: number;
    success: boolean;
    message: string;
    data?: T;
    pagination? : Pagination;
    errors?: FieldError[];
}