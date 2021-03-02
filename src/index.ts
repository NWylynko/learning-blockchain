import "source-map-support/register";
import { Chain } from "./Chain";
import { Wallet } from "./Wallet";

const satashi = new Wallet();
const bob = new Wallet();
const alice = new Wallet();

satashi.sendMoney({ amount: 50, payeePublicKey: bob.publicKey });
bob.sendMoney({ amount: 20, payeePublicKey: alice.publicKey });
alice.sendMoney({ amount: 5, payeePublicKey: bob.publicKey });
alice.sendMoney({ amount: 5, payeePublicKey: bob.publicKey });

console.log(Chain.instance);
