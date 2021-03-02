import * as crypto from "crypto";
import { Transaction } from "./Transaction";

export class Block {
  // a block holds the transaction and the previous hash, the timestamp is only for ordering purposes and isn't needed but is helpful

  public nonce = Math.round(Math.random() * 999999999);

  constructor(
    public prevHash: string,
    public transaction: Transaction,
    public timestamp = Date.now()
  ) {}

  get hash() {
    // this getter returns this block as a hash so it can be used in the next block to create integrity that the chain is untampered
    const str = JSON.stringify(this);
    const hash = crypto.createHash("SHA256");
    hash.update(str).end();
    return hash.digest("hex");
  }
}
