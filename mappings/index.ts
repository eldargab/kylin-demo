import {CurrencyId} from "@acala-network/types/interfaces"
import {Balance, Block} from "@polkadot/types/interfaces"
import primitivesConfig from '@acala-network/type-definitions/primitives'
import {DatabaseManager, EntityConstructor, EventContext, StoreContext, SubstrateEvent} from "@subsquid/hydra-common"
import {SubstrateBlock} from "@subsquid/hydra-common/lib/interfaces"
import assert from "assert"
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
    let [who, currency0, amount0, currency1, amount1, shareIncrement] = new Dex.AddLiquidityEvent(event).params
    if (!currency0.isToken || !currency1.isToken) return
    await addLiquidityChange(
        store,
        block,
        event,
        LiquidityChangeReason.ADD,
        currency0,
        currency1,
        amount0.toBn(),
        amount1.toBn()
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
    amount0: BN,
    amount1: BN,
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
        initial.step = 0
        initial.reason = LiquidityChangeReason.INIT
        initial.currencyZero = currency0.asToken.toString()
        initial.currencyOne = currency1.asToken.toString()
        initial.amountZero = new BN(0)
        initial.amountOne = new BN(0)
        initial.balanceZero = b0.toBn()
        initial.balanceOne = b1.toBn()
        await store.save(initial)
    }
    let balance = await getPrevBalance(store, currency0, currency1)
    let change = new LiquidityChange()
    change.id = swapStep ? event.id + '-' + swapStep : event.id
    change.timestamp = new BN(block.timestamp)
    change.blockNumber = block.height
    change.eventIdx = event.indexInBlock
    change.step = swapStep || 0
    change.reason = reason
    change.currencyZero = currency0.asToken.toString()
    change.currencyOne = currency1.asToken.toString()
    change.amountZero = amount0
    change.amountOne = amount1
    change.balanceZero = balance[0].add(amount0)
    change.balanceOne = balance[1].add(amount1)
    await store.save(change)
}


async function getPrevBalance(store: DatabaseManager, currency0: CurrencyId, currency1: CurrencyId): Promise<[BN, BN]> {
    let rows = await store.find(LiquidityChange, {
        select: ['balanceZero', 'balanceOne'],
        where: {
            currencyZero: currency0.asToken.toString(),
            currencyOne: currency1.asToken.toString()
        },
        order: {
            blockNumber: 'DESC',
            eventIdx: 'DESC',
            step: 'DESC'
        },
        take: 1
    })
    assert(rows.length == 1)
    return [rows[0].balanceZero, rows[0].balanceOne]
}


function get<T>(store: StoreContext['store'], entityConstructor: EntityConstructor<T>, id: string): Promise<T | undefined> {
    return store.get(entityConstructor, {where: {id}})
}


export function getBlockTimestamp(block: Block): number {
    let ex = block.extrinsics.find(({method: {method, section}}) => section === 'timestamp' && method === 'set')
    return ex ? (ex.args[0].toJSON() as number) : 0
}
