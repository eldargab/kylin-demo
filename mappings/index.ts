import {CurrencyId} from "@acala-network/types/interfaces"
import {Balance, Block} from "@polkadot/types/interfaces"
import primitivesConfig from '@acala-network/type-definitions/primitives'
import {DatabaseManager, EntityConstructor, EventContext, StoreContext, SubstrateEvent} from "@subsquid/hydra-common"
import {SubstrateBlock} from "@subsquid/hydra-common/lib/interfaces"
import BN from "bn.js"
import {Dex} from "../chain"
import {LiquidityChange, LiquidityChangeReason, Swap} from "../generated/model"
import {acala} from "./api"


export async function handleSwap({store, event, block}: EventContext & StoreContext): Promise<void> {
    let [account, path, changes] = new Dex.SwapEvent(event).params
    let timestamp = new BN(block.timestamp)
    for (let i = 1; i < path.length; i++) {
        let fromCurrency = path[i-1]
        let toCurrency = path[i]
        if (!fromCurrency.isToken || !toCurrency.asToken) continue
        let fromAmount = changes[i-1].toBn()
        let toAmount = changes[i].toBn()

        await store.save(new Swap({
            id: event.id + '-' + i,
            blockNumber: block.height,
            eventIdx: event.indexInBlock,
            step: i,
            timestamp,
            fromCurrency: fromCurrency.asToken.toString(),
            toCurrency: toCurrency.asToken.toString(),
            fromAmount,
            toAmount
        }))

        let [currency0, currency1] = getTraidingPair(fromCurrency, toCurrency)
        let b0 = currency0 === fromCurrency ? fromAmount : toAmount.neg()
        let b1 = currency1 === fromCurrency ? fromAmount : toAmount.neg()
        await addLiquidityChange(
            store,
            block,
            event,
            LiquidityChangeReason.SWAP,
            currency0,
            currency1,
            b0,
            b1,
            i
        )
    }
}


function getTraidingPair(currencyA: CurrencyId, currencyB: CurrencyId): [CurrencyId, CurrencyId] {
    let order: Record<string, number> = primitivesConfig.types.TokenSymbol._enum
    return [currencyA, currencyB].sort((a, b) => {
        return order[a.asToken.toString()] - order[b.asToken.toString()]
    }) as [CurrencyId, CurrencyId]
}


export async function handleAddLiquidity({store, event, block}: EventContext & StoreContext): Promise<void> {
    let [who, currency0, balance0, currency1, balance1, shareIncrement] = new Dex.AddLiquidityEvent(event).params
    if (!currency0.isToken || !currency1.isToken) return
    await addLiquidityChange(
        store,
        block,
        event,
        LiquidityChangeReason.ADD,
        currency0,
        currency1,
        balance0.toBn(),
        balance1.toBn()
    )
}


export async function handleRemoveLiquidity({store, event, block}: EventContext & StoreContext): Promise<void> {
    let [who, currency0, balance0, currency1, balance1, shareDecrement] = new Dex.RemoveLiquidityEvent(event).params
    if (!currency0.isToken || !currency1.isToken) return
    await addLiquidityChange(
        store,
        block,
        event,
        LiquidityChangeReason.REMOVE,
        currency0,
        currency1,
        balance0.toBn().neg(),
        balance1.toBn().neg()
    )
}


async function addLiquidityChange(
    store: DatabaseManager,
    block: SubstrateBlock,
    event: SubstrateEvent,
    reason: LiquidityChangeReason,
    currency0: CurrencyId,
    currency1: CurrencyId,
    balance0: BN,
    balance1: BN,
    swapStep?: number
): Promise<void> {
    let pair = currency0.asToken.toString() + '-' + currency1.asToken.toString()
    let initial = await get(store, LiquidityChange, 'initial--' + pair)
    if (initial == null) {
        let api = await acala()
        let [b0, b1]: [Balance, Balance] = await api.query.dex.liquidityPool.at(block.parentHash, [currency0, currency1]) as any
        let parentBlock = await api.rpc.chain.getBlock(block.parentHash)
        initial = new LiquidityChange()
        initial.id = 'initial--' + pair
        initial.timestamp = new BN(getBlockTimestamp(parentBlock.block))
        initial.blockNumber = block.height - 1
        initial.eventIdx = -1
        initial.reason = LiquidityChangeReason.INIT
        initial.currencyZero = currency0.asToken.toString()
        initial.currencyOne = currency1.asToken.toString()
        initial.balanceZero = b0.toBn()
        initial.balanceOne = b1.toBn()
        await store.save(initial)
    }
    let change = new LiquidityChange()
    change.id = swapStep ? event.id + '-' + swapStep : event.id
    change.timestamp = new BN(block.timestamp)
    change.blockNumber = block.height
    change.eventIdx = event.indexInBlock
    change.reason = reason
    change.currencyZero = currency0.asToken.toString()
    change.currencyOne = currency1.asToken.toString()
    change.balanceZero = balance0
    change.balanceOne = balance1
    await store.save(change)
}


function get<T>(store: StoreContext['store'], entityConstructor: EntityConstructor<T>, id: string): Promise<T | undefined> {
    return store.get(entityConstructor, {where: {id}})
}


export function getBlockTimestamp(block: Block): number {
    let ex = block.extrinsics.find(({method: {method, section}}) => section === 'timestamp' && method === 'set')
    return ex ? (ex.args[0].toJSON() as number) : 0
}
