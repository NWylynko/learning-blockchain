import * as crypto from "crypto";
import { Transaction } from "./Transaction";
import { Block } from "./Block";
import { satoshi } from "./SatoshiWallet";
import { mine } from "./MinersManager"

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

  addBlock({ transaction, senderPublicKey, signature }: newBlock) {
    // this runs on the nodes the transaction is the newly requested block getting added to the chain

    // i think this needs to do what the wallets balance getter does and verify that the wallet has the funds to make the transaction (maybe thats what mining is ????)

    // this creates a "verifier" with the hash of the transaction which than can be verified against
    // the signature and senderPublicKey to verify that the transaction hasn't been tampered with
    const verifier = crypto.createVerify("SHA256");
    verifier.update(transaction.toString());
    const isValid = verifier.verify(senderPublicKey, signature);

    if (isValid) {
      // if the transaction is valid it wraps it in a black with the last block hash and the new transaction
      const newBlock = new Block(this.lastBlock.hash, transaction);

      // this then gets "mined" to create proof of work
      // the solution needs to be added to the block for later verification
      const { solution, publicKey } = mine(newBlock.nonce);

      // add the solution and public key of the miner to the new block
      newBlock.solution = solution;
      newBlock.minerWinnerPublicKey = publicKey;

      // all the nodes running a copy of the chain needs to come to a consensus that this was the winner
      // im not entirely sure how to do this

      // once its been mined it then pushes this to the chain and is cemented in stone basically
      this.chain.push(newBlock);

      // my guess is that the mine() function will send the new block out to a bunch of miners
      // once one of the miners gets the solution (by basically guessing) it returns the solution
      // the other miners than check the solution to see if it returns true ???

      // the miners needs some way of proving that it guessed the solution so it can claim the prize (1 coin)
    }
  }
}
