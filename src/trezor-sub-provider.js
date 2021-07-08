const HookedWalletSubprovider = require("web3-provider-engine/subproviders/hooked-wallet.js");
const {
    getAddress,
    signTransaction
} = require("./trezor")

class TrezorSubProvider extends HookedWalletSubprovider {
    constructor(path) {
        console.log(`Creating TrezorSubProvider with path: ${path}`)
        super({
            getAccounts: function (cb) {
                getAddress(path)
                    .then(address => [address])
                    .then(value => cb(null, value))
                    .catch(cb)
            },
            signTransaction: function (tx, cb) {
                console.log(`signTransaction path: ${path} ${tx}`)
                signTransaction(path, tx)
                    .then(value => cb(null, value))
                    .catch(cb)
            }
        });
    }
}

module.exports = TrezorSubProvider
