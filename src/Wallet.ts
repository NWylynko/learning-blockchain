import * as crypto from "crypto";
import { Transaction } from "./Transaction";
import { Chain } from "./Chain";

export class Wallet {
  // the public key is the string that is shared and used for an account to get sent money
  public publicKey: string;

  // the private key is private to the owner, anyone with the private key could send all the money out of its account
  public privateKey: string;

  constructor() {
    // this generates a new public and private key combination
    const keyPair = crypto.generateKeyPairSync("rsa", {
      // 2048 bytes is standard security and takes years for modern computers to crack
      modulusLength: 2048,

      // spki is simple public key infrastructure
      publicKeyEncoding: { type: "spki", format: "pem" },
      // pkcs is public-key cryptography standards
      privateKeyEncoding: { type: "pkcs8", format: "pem" },
      // pem is privacy-enhanced mail
      // im guessing its creation was for securing emails but it can be applied to anything that needs secure transfer
    });

    this.privateKey = keyPair.privateKey;
    this.publicKey = keyPair.publicKey;
  }

  sendMoney({
    amount,
    payeePublicKey,
  }: {
    amount: number;
    payeePublicKey: string;
  }) {
    // create a new transaction, this takes the amount of money being sent, the public key of the person paying and the public key of the person being payed
    // a transaction cant store the private key as every transaction is public information
    const transaction = new Transaction(amount, this.publicKey, payeePublicKey);

    // here we are creating a signer, it takes the transaction and signs it with the senders private key
    // this creates proof that the money coming out of the account was from the person who owns the account
    // this is by creating a "one time password" that allows anyone to verify the identity of the account without
    // needing the private key of the account
    const sign = crypto.createSign("SHA256");
    sign.update(transaction.toString()).end();
    const signature = sign.sign(this.privateKey);

    // this asks the chain to add the new transaction to the chain
    // it takes the transaction to be added
    // the public and private key of the sender to provide proof that they are allowed to send the money
    // in the "real world" this would then send a network request to all the nodes asking to add it to the chain (i think???)
    Chain.instance.addBlock({
      transaction,
      senderPublicKey: this.publicKey,
      signature,
    });
  }

  get balance(): number {
    // this getter will go through the entire chain and get the balance of the account
    // it doesn't verify anything (i think maybe it needs to verify that the solution + nonce have the hex starting with 0000)
    // or maybe it needs to hash each block and check that the next block has the prevHash the same as the one before it
    // maybe it needs to do both

    let balance = 0; // everyone's accounts started at 0 at the start of time

    Chain.instance.chain.forEach((block) => {

      // if this wallet is attached to the miner then they get 1 coin for getting the solution
      if (block.minerWinnerPublicKey === this.publicKey) {
        balance += 1
      }

      if (block.transaction.payer === this.publicKey) {
        // if they are the payer they are sending money
        balance -= block.transaction.amount;
      } else if (block.transaction.payee === this.publicKey) {
        // if they are the payee they are receiving money
        balance += block.transaction.amount;
      }
    });

    return balance;
  }
}
