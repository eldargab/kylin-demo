import {CurrencyId} from "@acala-network/types/interfaces"
import {Balance} from "@polkadot/types/interfaces"
import {EntityConstructor, EventContext, StoreContext} from "@subsquid/hydra-common"
import {SubstrateBlock} from "@subsquid/hydra-common/lib/interfaces"
import BN from "bn.js"
import {Dex} from "../chain"
import {LiquidityChange, Swap} from "../generated/model"
import {acala} from "./api"


export async function handleSwap({store, event, block}: EventContext & StoreContext): Promise<void> {
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


export async function handleAddLiquidity({store, event, block}: EventContext & StoreContext): Promise<void> {
    let [who, currency0, balance0, currency1, balance1, shareIncrement] = new Dex.AddLiquidityEvent(event).params
    if (!currency0.isToken || !currency1.isToken) return
    await ensureInitialLiquidity(store, currency0, currency1, block)
    let change = new LiquidityChange()
    change.id = event.id
    change.timestamp = new BN(block.timestamp)
    change.blockNumber = block.height
    change.eventIdx = event.indexInBlock
    change.currencyZero = currency0.asToken.toString()
    change.currencyOne = currency1.asToken.toString()
    change.balanceZero = balance0.toBn()
    change.balanceOne = balance1.toBn()
    change.liquidity = shareIncrement.toBn()
    await store.save(change)
}


export async function handleRemoveLiquidity({store, event, block}: EventContext & StoreContext): Promise<void> {
    let [who, currency0, balance0, currency1, balance1, shareDecrement] = new Dex.RemoveLiquidityEvent(event).params
    await ensureInitialLiquidity(store, currency0, currency1, block)
    let change = new LiquidityChange()
    change.id = event.id
    change.timestamp = new BN(block.timestamp)
    change.blockNumber = block.height
    change.eventIdx = event.indexInBlock
    change.currencyZero = currency0.asToken.toString()
    change.currencyOne = currency1.asToken.toString()
    change.balanceZero = balance0.toBn().neg()
    change.balanceOne = balance1.toBn().neg()
    change.liquidity = shareDecrement.toBn().neg()
    await store.save(change)
}


async function ensureInitialLiquidity(
    store: StoreContext['store'],
    currency0: CurrencyId,
    currency1: CurrencyId,
    block: SubstrateBlock
): Promise<void> {
    let pair = currency0.asToken.toString() + '-' + currency1.asToken.toString()
    let initial = await get(store, LiquidityChange, 'initial-' + pair)
    if (initial != null) return
    let api = await acala()
    let [b0, b1]: [Balance, Balance] = await api.query.dex.liquidityPool.at(block.parentHash, [currency0, currency1]) as any
    let share: Balance = await api.query.tokens.totalIssuance.at(block.parentHash, {dexShare: [currency0, currency1]})
    initial = new LiquidityChange()
    initial.id = 'initial--' + pair
    initial.blockNumber = block.height - 1
    initial.eventIdx = -1
    initial.currencyZero = currency0.asToken.toString()
    initial.currencyOne = currency1.asToken.toString()
    initial.balanceZero = b0.toBn()
    initial.balanceOne = b1.toBn()
    initial.liquidity = share.toBn()
    initial.timestamp = new BN(block.timestamp)
    await store.save(initial)
}


function get<T>(store: StoreContext['store'], entityConstructor: EntityConstructor<T>, id: string): Promise<T | undefined> {
    return store.get(entityConstructor, {where: {id}})
}
