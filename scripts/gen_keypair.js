const { Keypair } = require('@solana/web3.js');
const kp = Keypair.generate();
console.log(JSON.stringify({
  publicKey: kp.publicKey.toBase58(),
  secretKey: Array.from(kp.secretKey)
}));
