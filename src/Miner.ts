import * as crypto from "crypto";
import { Wallet } from "./Wallet";

export class Miner {

  constructor (
    private wallet = new Wallet()
  ) {}

  get publicKey() {
    return this.wallet.publicKey
  }

  get balance() {
    return this.wallet.balance
  }
  
  mine(nonce: number) {
    // this is the function to "mine" the new block
    // it basically is a guess and check function
    // "mining" is basically getting a computer to guess the solution to a puzzle

    // by setting the length of the 0000 to longer eg 000000 it increases the difficulty
    // bitcoin re-calculates the length of 0s every 2 weeks or so to keep the average length of mining to 10 minutes
    // while other cryptocurrencies have shorter lengths

    // the purpose of this is that it stops malicious actors from inserting transactions into the chain
    // this only works if the mining network is distributed and no one owns more than 50% of the nodes

    // it starts at 1 and goes up until the first 4 characters in the attempt are 0000 (im not sure whats special about that)
    // i think this needs to be changed to generate a random number and check
      // otherwise a malicious actor could put there own blocks in if they have the fastest computer
      // as on average they will be-able to generate the solution faster than any competition
      // where if the solution is random than the majority of miners will be able to get the solution on average faster
    // once it gets the solutions (what needs to be added the nonce for the hex representation to start with 0000)
    // it returns the solution
    // this can then be checked very easily by taking the nonce and solution and verifiying the first four digits are 0000

    // the first minor to guess the solution wins 1 of the coin as a reward
    // the solution needs to be stored with the block
    // the miners need there own wallet and add there public key to the block if they are successful to claim the coin
    let solution = 1;
    console.log("⛏  mining...");

    while (true) {
      const hash = crypto.createHash("MD5");
      hash.update((nonce + solution).toString()).end();

      const attempt = hash.digest("hex");

      if (attempt.substr(0, 4) === "0000") {
        console.log(`Solved: ${solution}`);
        return { solution, publicKey: this.publicKey };
      }

      solution += 1;
    }
  }
}