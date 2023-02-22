export class WalletResponse{
    walletAddress: string;
    amount: string;
    constructor(walletResponse: WalletResponse) {
        this.walletAddress = walletResponse.walletAddress;
        this.amount = walletResponse.amount;
    }
}