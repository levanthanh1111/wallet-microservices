import { TransactionResponse } from "../response/TransactionResponse";

export interface HistoryResponse {
    history : TransactionResponse;
    action: string;
}