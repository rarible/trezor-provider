const Web3ProviderEngine = require("web3-provider-engine");
const SubscriptionsSubprovider = require('web3-provider-engine/subproviders/filters');
const RpcSource = require("web3-provider-engine/subproviders/rpc");
const TrezorSubProvider = require("./trezor-sub-provider")

module.exports = function (url, path) {
    const engine = new Web3ProviderEngine()
    engine.addProvider(new TrezorSubProvider(path))
    engine.addProvider(new SubscriptionsSubprovider())
    engine.addProvider(new RpcSource({ rpcUrl: url }))
    engine.start()
    return engine
}
