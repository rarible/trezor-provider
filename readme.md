# TrezorSubProvider

This is a subprovider for Metamask's [web3-provider-engine](https://github.com/MetaMask/web3-provider-engine). Also, there is a factory for creating web3 providers. This subprovider can be used to sign transaction with Truffle (during migrate or inside a console).

So, you can secure your deployments and other contract interactions using Trezor's hardware wallets.

## Usage

Install `@rarible/trezor-provider` and use it inside `truffle-config.js`:

```js
const { createProvider } = require('@rarible/trezor-provider')

module.exports = {
    networks: {
        ropsten: {
            provider: function() {
                //websocket and http urls are supported
                return createProvider({ url: "{infura or other}", path: "m/44'/60'/0'/0/0", chainId: 3 }) 
            },
            network_id: 3
        }
    }
};
```

Java 8 or higher is required to run this (UI should be rendered to show PIN and passphrase enter dialogs).

Source code is included in the ui folder.

## Construct your own provider using Metamask's provider engine

If you want to construct custom provider, then use `TrezorSubProvider`

```javascript
const { TrezorSubProvider } = require('@rarible/trezor-provider')

const trezor = new TrezorSubProvider({ path: "your path", chainId: 1 }) 
```

Then use this sub provider with `Web3ProviderEngine`

## Suggestions

You are welcome to [suggest features](https://github.com/rarible/protocol/discussions) and [report bugs found](https://github.com/rarible/protocol/issues)!

## License

TrezorSubProvider is available under [MIT License](LICENSE.md).
