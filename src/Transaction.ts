export class Transaction {
  // this class is basically just to store the individual transactions
  constructor(
    public amount: number,
    public payer: string, // public key
    public payee: string // public key
  ) {}

  toString() {
    // the transaction needs to be stored in a string so it can be encrypted
    return JSON.stringify(this);
  }
}
