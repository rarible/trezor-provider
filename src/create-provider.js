const Web3ProviderEngine = require("web3-provider-engine");
const SubscriptionsSubprovider = require('web3-provider-engine/subproviders/filters');
const RpcSource = require("web3-provider-engine/subproviders/rpc");
const WebsocketSubprovider = require("web3-provider-engine/subproviders/websocket");
const TrezorSubProvider = require("./trezor-sub-provider")

module.exports = function ({ url, path, chainId = 1 }) {
    const engine = new Web3ProviderEngine()
    engine.addProvider(new TrezorSubProvider({ path, chainId }))
    engine.addProvider(new SubscriptionsSubprovider())
    if (url.startsWith("ws")) {
        engine.addProvider(new WebsocketSubprovider({ rpcUrl: url }))
    } else {
        engine.addProvider(new RpcSource({ rpcUrl: url }))
    }
    engine.start()
    engine.send = engine.sendAsync
    return engine
}
