const HookedWalletSubprovider = require("web3-provider-engine/subproviders/hooked-wallet.js");
const {
    getAddress,
    signTransaction
} = require("./trezor")

class TrezorSubProvider extends HookedWalletSubprovider {
    constructor({ path, chainId = 1 }) {
        super({
            getAccounts: function (cb) {
                getAddress(path)
                    .then(address => [address])
                    .then(value => cb(null, value))
                    .catch(cb)
            },
            signTransaction: function (tx, cb) {
                signTransaction(path, tx, chainId)
                    .then(value => cb(null, value))
                    .catch(cb)
            }
        });
    }
}

module.exports = TrezorSubProvider
