import {EventContext, StoreContext} from "@subsquid/hydra-common"
import BN from "bn.js"
import {Dex} from "../chain"
import {Swap} from "../generated/model"


export async function handleSwap({store, event, block}: EventContext & StoreContext) {
    let [account, path, changes] = new Dex.SwapEvent(event).params
    let timestamp = new BN(block.timestamp)
    for (let i = 1; i < path.length; i++) {
        let fromCurrency = path[i-1]
        let toCurrency = path[i]
        if (fromCurrency.isToken && toCurrency.isToken) {
            await store.save(new Swap({
                id: event.id + '-' + i,
                timestamp,
                fromCurrency: fromCurrency.asToken.toString(),
                toCurrency: toCurrency.asToken.toString(),
                fromAmount: changes[i-1].toBn(),
                toAmount: changes[i].toBn()
            }))
        }
    }
}
