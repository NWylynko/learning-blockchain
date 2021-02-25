import "source-map-support/register";
import { Chain } from "./Chain";
import { Wallet } from "./Wallet";
import { satoshi } from "./SatoshiWallet";
import { Miner1 } from "./MinersManager"

const bob = new Wallet();
const alice = new Wallet();

console.log(`satoshi's balance: ${satoshi.balance}`);
console.log(`bob's balance: ${bob.balance}`);
console.log(`alice's balance: ${alice.balance}`);

console.log(`sending 50 from satoshi to bob`);
satoshi.sendMoney({ amount: 50, payeePublicKey: bob.publicKey });
console.log(`satoshi's balance: ${satoshi.balance}`);
console.log(`bob's balance: ${bob.balance}`);

console.log(`sending 20 from bob to alice`);
bob.sendMoney({ amount: 20, payeePublicKey: alice.publicKey });
console.log(`bob's balance: ${bob.balance}`);
console.log(`alice's balance: ${alice.balance}`);

console.log(`sending 5 from alice to bob`);
alice.sendMoney({ amount: 5, payeePublicKey: bob.publicKey });
console.log(`alice's balance: ${alice.balance}`);
console.log(`bob's balance: ${bob.balance}`);

console.log(`sending 5 from alice to bob`);
alice.sendMoney({ amount: 5, payeePublicKey: bob.publicKey });
console.log(`alice's balance: ${alice.balance}`);
console.log(`bob's balance: ${bob.balance}`);

console.log(`satoshi's closing balance: ${satoshi.balance}`);
console.log(`bob's closing balance: ${bob.balance}`);
console.log(`alice's closing balance: ${alice.balance}`);
console.log(`Miner 1 balance: ${Miner1.balance}`)

console.log(Chain.instance);
