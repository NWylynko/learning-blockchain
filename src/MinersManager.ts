import { Miner } from "./Miner"

// this is exported purely so we can get its balance in index.ts
export const Miner1 = new Miner()

// id call this a relay, i think it needs to sit between the chains and the miners
// the miners just need to know the ip address and port of one relay
// the relays need to know the ip address and port of one other relay
// the relays hold a list of miners and relays known to it
// every so often (every minute or so) the relay sends a request to the relays it knows
  // asking for a hash of the array of all the relays the other relay knows about
  // if the hash it receives is different to the hash of its own relays
  // it sends a request for all the relays known relays
    // it then combines the list and continues on
// i haven't decided yet but a miner could either be rest (expressjs) or it could periodically send requests to the relay for new block
// if the miner is listening on a port then the relay needs to hold an array of known miners
  // this doesn't necessarily need to be in sync with other relays as duplicate requests will then be sent
    // duplicate requests wouldn't necessarily matter as miners could just throw away requests if its currently busy
// on the other hand miners could send a request to relays asking for the latest nonce
// this request would only be sent from miners if they are not doing any mining
// miners would need to send a request (maybe every minute or 10 seconds) to check if the current block has a solution
  // the miner could then quickly verify the solution and if its not the correct solution could just keep going (maybeeeee)
export const mine = (nonce: number) => {
  // this needs to spin up workers with all the miners
  // in the "real world" this would send network requests to all the known miners
  // with the nonce
  return Miner1.mine(nonce)
}