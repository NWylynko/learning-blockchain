import * as crypto from "crypto";
import { Transaction } from "./Transaction";

export class Block {
  // a block holds the transaction and the previous hash, the timestamp is only for ordering purposes and isn't needed but is helpful

  constructor(
    // stores the hash of the previous block
    public prevHash: string,

    // stores the transaction requested, this could and should be changed to a list
    public transaction: Transaction,

    // the timestamp of when the block was created, purely for ordering purposes
    public timestamp = Date.now(),

    // a nonce is a random number that when added to the solution and hashed the first 4 bytes are 0000 (or whatever the difficulty is)
    public nonce = Math.round(Math.random() * 999999999),

    // this is the solution, the first miner to guess the number "wins"
    public solution?: number,

    // the "winer" miner adds there public key to claim the prize
    public minerWinnerPublicKey?: string
  ) {}

  get hash() {
    // this getter returns this block as a hash so it can be used in the next block to create integrity that the chain is untampered
    const str = JSON.stringify(this);
    const hash = crypto.createHash("SHA256");
    hash.update(str).end();
    return hash.digest("hex");
  }
}
