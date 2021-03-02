import * as crypto from "crypto";
import { Transaction } from "./Transaction";
import { Block } from "./Block";
import { satoshi } from "./SatoshiWallet";

interface newBlock {
  transaction: Transaction;
  senderPublicKey: string;
  signature: NodeJS.ArrayBufferView;
}

export class Chain {
  public static instance = new Chain();

  // in the "real world" this would be a database so the chain is stored in case of the program crashing
  chain: Block[];

  constructor() {
    // this creates the chain, and creates the first Block with a transaction
    // from "genesis" to satoshi

    this.chain = [
      new Block("0", new Transaction(100, "genesis", satoshi.publicKey)),
    ];
  }

  get lastBlock() {
    // this returns the last block in the chain, this is mainly used to then create the next block
    // the last block needs to be stored in the next block so they chain can be verified as legit and untampered
    return this.chain[this.chain.length - 1];
  }

  mine(nonce: number) {
    // this is the function to "mine" the new block and verify that it is legit
    // it basically is a guess and check function
    // it starts at 1 and goes up until the first 4 characters in the attempt are 0000 (im not sure whats special about that)
    // once it gets the solutions (what needs to be added the nonce for the hex representation to start with 0000)
    // it returns the solution
    // this can then be checked very easily by taking the nonce and solution and verifiying the first four digits ate 0000
    // the first minor to guess the solution wins 1 of the coin as a reward
    let solution = 1;
    console.log("⛏  mining...");

    while (true) {
      const hash = crypto.createHash("MD5");
      hash.update((nonce + solution).toString()).end();

      const attempt = hash.digest("hex");

      if (attempt.substr(0, 4) === "0000") {
        console.log(`Solved: ${solution}`);
        return solution;
      }

      solution += 1;
    }
  }

  addBlock({ transaction, senderPublicKey, signature }: newBlock) {
    // this runs on the nodes the transaction is the newly requested block getting added to the chain

    // this creates a "verifier" with the hash of the transaction which than can be verified against
    // the signature and senderPublicKey to verify that the transaction hasn't been tampered with
    const verifier = crypto.createVerify("SHA256");
    verifier.update(transaction.toString());
    const isValid = verifier.verify(senderPublicKey, signature);

    if (isValid) {
      // if the transaction is valid it wraps it in a black with the last block hash and the new transaction
      const newBlock = new Block(this.lastBlock.hash, transaction);

      // this then gets "mined" which im still unsure about
      const solution = this.mine(newBlock.nonce);

      // once its been mined it then pushes this to the chain and is cemented in stone basically
      this.chain.push(newBlock);

      // my guess is that the mine() function will send the new block out to a bunch of miners
      // once one of the miners gets the solution (by basically guessing) it returns the solution
      // the other miners than check the solution to see if it returns true ???

      // the miners needs some way of proving that it guessed the solution so it can claim the prize (1 coin)
    }
  }
}
