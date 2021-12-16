const TrezorConnect = require('trezor-connect').default
const Transaction = require('@ethereumjs/tx').Transaction
const showUi = require('./ui')

TrezorConnect.manifest({
    email: 'e@rarible.com',
    appUrl: 'https://github.com/rarible/trezor-provider'
})

function normalize(hex) {
    if (hex == null) {
        return null;
    }
    if (hex.startsWith("0x")) {
        hex = hex.substring(2);
    }
    if (hex.length % 2 !== 0) {
        hex = "0" + hex;
    }
    return hex;
}

function buffer(hex) {
    if (hex == null) {
        return new Buffer('', 'hex');
    } else {
        return new Buffer(normalize(hex), 'hex');
    }
}

TrezorConnect.on("UI_EVENT", e => {
    if (e.type === "ui-request_pin") {
        showUi("io.daonomic.trezor.AskPin")
            .then(payload => {
                TrezorConnect.uiResponse({ type: "ui-receive_pin", payload })
            })
            .catch(err => console.error("Unhandled", err));
    } else if (e.type === "ui-request_passphrase") {
        showUi("io.daonomic.trezor.AskPassphrase")
            .then(payload => {
                TrezorConnect.uiResponse({ type: "ui-receive_passphrase", payload: { save: true, value: payload, passphraseOnDevice: false } })
            })
    } else if (e.type === "ui-request_confirmation") {
        TrezorConnect.uiResponse({ type: "ui-receive_confirmation", payload: true })
    }
})

module.exports = {
    getAddress: function(path) {
        return TrezorConnect.ethereumGetAddress({ path, showOnTrezor: false })
            .then(result => {
                if (result.success) {
                    return result.payload.address
                } else {
                    return Promise.reject(result.payload)
                }
            })
    },
    signTransaction(path, tx, chainId) {
        const transaction = { ...tx, gasLimit: tx.gas, chainId, to: tx.to || "0x", value: tx.value || "0x0" }
        return TrezorConnect.ethereumSignTransaction({ path, transaction } )
            .then(signature => {
                if (signature.success) {
                    const signed = new Transaction({
                        nonce: buffer(tx.nonce),
                        gasPrice: buffer(tx.gasPrice),
                        gasLimit: buffer(tx.gas),
                        to: buffer(tx.to),
                        value: buffer(tx.value),
                        data: buffer(tx.data),
                        v: signature.payload.v,
                        r: buffer(signature.payload.r),
                        s: buffer(signature.payload.s),
                        chainId: chainId,
                    })
                    return `0x${signed.serialize().toString('hex')}`
                } else {
                    return Promise.reject(signature.payload)
                }
            })
    }
}

