const TrezorConnect = require('trezor-connect').default
const showUi = require('./ui')

TrezorConnect.manifest({
    email: 'e@rarible.com',
    appUrl: 'https://github.com/rariblecom/trezor-provider'
})

TrezorConnect.on("UI_EVENT", e => {
    console.log("got ui event", e)
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
    signTransaction(path, transaction) {
        return TrezorConnect.ethereumSignTransaction({ path, transaction } )
    }
}

