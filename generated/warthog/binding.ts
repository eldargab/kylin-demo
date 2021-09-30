import 'graphql-import-node'; // Needed so you can import *.graphql files 

import { makeBindingClass, Options } from 'graphql-binding'
import { GraphQLResolveInfo, GraphQLSchema } from 'graphql'
import { IResolvers } from 'graphql-tools/dist/Interfaces'
import * as schema from  './schema.graphql'

export interface Query {
    liquidityChanges: <T = Array<LiquidityChange>>(args: { offset?: Int | null, limit?: Int | null, where?: LiquidityChangeWhereInput | null, orderBy?: Array<LiquidityChangeOrderByInput> | null }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    liquidityChangeByUniqueInput: <T = LiquidityChange | null>(args: { where: LiquidityChangeWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T | null> ,
    liquidityChangesConnection: <T = LiquidityChangeConnection>(args: { first?: Int | null, after?: String | null, last?: Int | null, before?: String | null, where?: LiquidityChangeWhereInput | null, orderBy?: Array<LiquidityChangeOrderByInput> | null }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    swaps: <T = Array<Swap>>(args: { offset?: Int | null, limit?: Int | null, where?: SwapWhereInput | null, orderBy?: Array<SwapOrderByInput> | null }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    swapByUniqueInput: <T = Swap | null>(args: { where: SwapWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T | null> ,
    swapsConnection: <T = SwapConnection>(args: { first?: Int | null, after?: String | null, last?: Int | null, before?: String | null, where?: SwapWhereInput | null, orderBy?: Array<SwapOrderByInput> | null }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    ratesHistory: <T = Array<ExchangeStats>>(args: { params: ExchangeRatesInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    currentExchangeRates: <T = Array<ExchangeStats>>(args: { intervalMinutes?: Int | null }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    lastExchanges: <T = Array<LastExchange>>(args?: {}, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> 
  }

export interface Mutation {}

export interface Subscription {
    stateSubscription: <T = ProcessorState>(args?: {}, info?: GraphQLResolveInfo | string, options?: Options) => Promise<AsyncIterator<T>> 
  }

export interface Binding {
  query: Query
  mutation: Mutation
  subscription: Subscription
  request: <T = any>(query: string, variables?: {[key: string]: any}) => Promise<T>
  delegate(operation: 'query' | 'mutation', fieldName: string, args: {
      [key: string]: any;
  }, infoOrQuery?: GraphQLResolveInfo | string, options?: Options): Promise<any>;
  delegateSubscription(fieldName: string, args?: {
      [key: string]: any;
  }, infoOrQuery?: GraphQLResolveInfo | string, options?: Options): Promise<AsyncIterator<any>>;
  getAbstractResolvers(filterSchema?: GraphQLSchema | string): IResolvers;
}

export interface BindingConstructor<T> {
  new(...args: any[]): T
}

export const Binding = makeBindingClass<BindingConstructor<Binding>>({ schema: schema as any })

/**
 * Types
*/

export type LiquidityChangeOrderByInput =   'createdAt_ASC' |
  'createdAt_DESC' |
  'updatedAt_ASC' |
  'updatedAt_DESC' |
  'deletedAt_ASC' |
  'deletedAt_DESC' |
  'timestamp_ASC' |
  'timestamp_DESC' |
  'blockNumber_ASC' |
  'blockNumber_DESC' |
  'eventIdx_ASC' |
  'eventIdx_DESC' |
  'step_ASC' |
  'step_DESC' |
  'reason_ASC' |
  'reason_DESC' |
  'currencyZero_ASC' |
  'currencyZero_DESC' |
  'currencyOne_ASC' |
  'currencyOne_DESC' |
  'amountZero_ASC' |
  'amountZero_DESC' |
  'amountOne_ASC' |
  'amountOne_DESC' |
  'balanceZero_ASC' |
  'balanceZero_DESC' |
  'balanceOne_ASC' |
  'balanceOne_DESC'

export type LiquidityChangeReason =   'INIT' |
  'SWAP' |
  'ADD' |
  'REMOVE'

export type SwapOrderByInput =   'createdAt_ASC' |
  'createdAt_DESC' |
  'updatedAt_ASC' |
  'updatedAt_DESC' |
  'deletedAt_ASC' |
  'deletedAt_DESC' |
  'timestamp_ASC' |
  'timestamp_DESC' |
  'blockNumber_ASC' |
  'blockNumber_DESC' |
  'eventIdx_ASC' |
  'eventIdx_DESC' |
  'step_ASC' |
  'step_DESC' |
  'fromCurrency_ASC' |
  'fromCurrency_DESC' |
  'toCurrency_ASC' |
  'toCurrency_DESC' |
  'fromAmount_ASC' |
  'fromAmount_DESC' |
  'toAmount_ASC' |
  'toAmount_DESC'

export interface BaseWhereInput {
  id_eq?: String | null
  id_in?: String[] | String | null
  createdAt_eq?: String | null
  createdAt_lt?: String | null
  createdAt_lte?: String | null
  createdAt_gt?: String | null
  createdAt_gte?: String | null
  createdById_eq?: String | null
  updatedAt_eq?: String | null
  updatedAt_lt?: String | null
  updatedAt_lte?: String | null
  updatedAt_gt?: String | null
  updatedAt_gte?: String | null
  updatedById_eq?: String | null
  deletedAt_all?: Boolean | null
  deletedAt_eq?: String | null
  deletedAt_lt?: String | null
  deletedAt_lte?: String | null
  deletedAt_gt?: String | null
  deletedAt_gte?: String | null
  deletedById_eq?: String | null
}

export interface ExchangeRatesInput {
  intervalMinutes: Int
  pair?: String | null
  periodFrom?: String | null
  periodTo?: String | null
}

export interface LiquidityChangeCreateInput {
  timestamp: String
  blockNumber: Float
  eventIdx: Float
  step: Float
  reason: LiquidityChangeReason
  currencyZero: String
  currencyOne: String
  amountZero: String
  amountOne: String
  balanceZero: String
  balanceOne: String
}

export interface LiquidityChangeUpdateInput {
  timestamp?: String | null
  blockNumber?: Float | null
  eventIdx?: Float | null
  step?: Float | null
  reason?: LiquidityChangeReason | null
  currencyZero?: String | null
  currencyOne?: String | null
  amountZero?: String | null
  amountOne?: String | null
  balanceZero?: String | null
  balanceOne?: String | null
}

export interface LiquidityChangeWhereInput {
  id_eq?: ID_Input | null
  id_in?: ID_Output[] | ID_Output | null
  createdAt_eq?: DateTime | null
  createdAt_lt?: DateTime | null
  createdAt_lte?: DateTime | null
  createdAt_gt?: DateTime | null
  createdAt_gte?: DateTime | null
  createdById_eq?: ID_Input | null
  createdById_in?: ID_Output[] | ID_Output | null
  updatedAt_eq?: DateTime | null
  updatedAt_lt?: DateTime | null
  updatedAt_lte?: DateTime | null
  updatedAt_gt?: DateTime | null
  updatedAt_gte?: DateTime | null
  updatedById_eq?: ID_Input | null
  updatedById_in?: ID_Output[] | ID_Output | null
  deletedAt_all?: Boolean | null
  deletedAt_eq?: DateTime | null
  deletedAt_lt?: DateTime | null
  deletedAt_lte?: DateTime | null
  deletedAt_gt?: DateTime | null
  deletedAt_gte?: DateTime | null
  deletedById_eq?: ID_Input | null
  deletedById_in?: ID_Output[] | ID_Output | null
  timestamp_eq?: BigInt | null
  timestamp_gt?: BigInt | null
  timestamp_gte?: BigInt | null
  timestamp_lt?: BigInt | null
  timestamp_lte?: BigInt | null
  timestamp_in?: BigInt[] | BigInt | null
  blockNumber_eq?: Int | null
  blockNumber_gt?: Int | null
  blockNumber_gte?: Int | null
  blockNumber_lt?: Int | null
  blockNumber_lte?: Int | null
  blockNumber_in?: Int[] | Int | null
  eventIdx_eq?: Int | null
  eventIdx_gt?: Int | null
  eventIdx_gte?: Int | null
  eventIdx_lt?: Int | null
  eventIdx_lte?: Int | null
  eventIdx_in?: Int[] | Int | null
  step_eq?: Int | null
  step_gt?: Int | null
  step_gte?: Int | null
  step_lt?: Int | null
  step_lte?: Int | null
  step_in?: Int[] | Int | null
  reason_eq?: LiquidityChangeReason | null
  reason_in?: LiquidityChangeReason[] | LiquidityChangeReason | null
  currencyZero_eq?: String | null
  currencyZero_contains?: String | null
  currencyZero_startsWith?: String | null
  currencyZero_endsWith?: String | null
  currencyZero_in?: String[] | String | null
  currencyOne_eq?: String | null
  currencyOne_contains?: String | null
  currencyOne_startsWith?: String | null
  currencyOne_endsWith?: String | null
  currencyOne_in?: String[] | String | null
  amountZero_eq?: BigInt | null
  amountZero_gt?: BigInt | null
  amountZero_gte?: BigInt | null
  amountZero_lt?: BigInt | null
  amountZero_lte?: BigInt | null
  amountZero_in?: BigInt[] | BigInt | null
  amountOne_eq?: BigInt | null
  amountOne_gt?: BigInt | null
  amountOne_gte?: BigInt | null
  amountOne_lt?: BigInt | null
  amountOne_lte?: BigInt | null
  amountOne_in?: BigInt[] | BigInt | null
  balanceZero_eq?: BigInt | null
  balanceZero_gt?: BigInt | null
  balanceZero_gte?: BigInt | null
  balanceZero_lt?: BigInt | null
  balanceZero_lte?: BigInt | null
  balanceZero_in?: BigInt[] | BigInt | null
  balanceOne_eq?: BigInt | null
  balanceOne_gt?: BigInt | null
  balanceOne_gte?: BigInt | null
  balanceOne_lt?: BigInt | null
  balanceOne_lte?: BigInt | null
  balanceOne_in?: BigInt[] | BigInt | null
  AND?: LiquidityChangeWhereInput[] | LiquidityChangeWhereInput | null
  OR?: LiquidityChangeWhereInput[] | LiquidityChangeWhereInput | null
}

export interface LiquidityChangeWhereUniqueInput {
  id: ID_Output
}

export interface SwapCreateInput {
  timestamp: String
  blockNumber: Float
  eventIdx: Float
  step: Float
  fromCurrency: String
  toCurrency: String
  fromAmount: String
  toAmount: String
}

export interface SwapUpdateInput {
  timestamp?: String | null
  blockNumber?: Float | null
  eventIdx?: Float | null
  step?: Float | null
  fromCurrency?: String | null
  toCurrency?: String | null
  fromAmount?: String | null
  toAmount?: String | null
}

export interface SwapWhereInput {
  id_eq?: ID_Input | null
  id_in?: ID_Output[] | ID_Output | null
  createdAt_eq?: DateTime | null
  createdAt_lt?: DateTime | null
  createdAt_lte?: DateTime | null
  createdAt_gt?: DateTime | null
  createdAt_gte?: DateTime | null
  createdById_eq?: ID_Input | null
  createdById_in?: ID_Output[] | ID_Output | null
  updatedAt_eq?: DateTime | null
  updatedAt_lt?: DateTime | null
  updatedAt_lte?: DateTime | null
  updatedAt_gt?: DateTime | null
  updatedAt_gte?: DateTime | null
  updatedById_eq?: ID_Input | null
  updatedById_in?: ID_Output[] | ID_Output | null
  deletedAt_all?: Boolean | null
  deletedAt_eq?: DateTime | null
  deletedAt_lt?: DateTime | null
  deletedAt_lte?: DateTime | null
  deletedAt_gt?: DateTime | null
  deletedAt_gte?: DateTime | null
  deletedById_eq?: ID_Input | null
  deletedById_in?: ID_Output[] | ID_Output | null
  timestamp_eq?: BigInt | null
  timestamp_gt?: BigInt | null
  timestamp_gte?: BigInt | null
  timestamp_lt?: BigInt | null
  timestamp_lte?: BigInt | null
  timestamp_in?: BigInt[] | BigInt | null
  blockNumber_eq?: Int | null
  blockNumber_gt?: Int | null
  blockNumber_gte?: Int | null
  blockNumber_lt?: Int | null
  blockNumber_lte?: Int | null
  blockNumber_in?: Int[] | Int | null
  eventIdx_eq?: Int | null
  eventIdx_gt?: Int | null
  eventIdx_gte?: Int | null
  eventIdx_lt?: Int | null
  eventIdx_lte?: Int | null
  eventIdx_in?: Int[] | Int | null
  step_eq?: Int | null
  step_gt?: Int | null
  step_gte?: Int | null
  step_lt?: Int | null
  step_lte?: Int | null
  step_in?: Int[] | Int | null
  fromCurrency_eq?: String | null
  fromCurrency_contains?: String | null
  fromCurrency_startsWith?: String | null
  fromCurrency_endsWith?: String | null
  fromCurrency_in?: String[] | String | null
  toCurrency_eq?: String | null
  toCurrency_contains?: String | null
  toCurrency_startsWith?: String | null
  toCurrency_endsWith?: String | null
  toCurrency_in?: String[] | String | null
  fromAmount_eq?: BigInt | null
  fromAmount_gt?: BigInt | null
  fromAmount_gte?: BigInt | null
  fromAmount_lt?: BigInt | null
  fromAmount_lte?: BigInt | null
  fromAmount_in?: BigInt[] | BigInt | null
  toAmount_eq?: BigInt | null
  toAmount_gt?: BigInt | null
  toAmount_gte?: BigInt | null
  toAmount_lt?: BigInt | null
  toAmount_lte?: BigInt | null
  toAmount_in?: BigInt[] | BigInt | null
  AND?: SwapWhereInput[] | SwapWhereInput | null
  OR?: SwapWhereInput[] | SwapWhereInput | null
}

export interface SwapWhereUniqueInput {
  id: ID_Output
}

export interface BaseGraphQLObject {
  id: ID_Output
  createdAt: DateTime
  createdById: String
  updatedAt?: DateTime | null
  updatedById?: String | null
  deletedAt?: DateTime | null
  deletedById?: String | null
  version: Int
}

export interface DeleteResponse {
  id: ID_Output
}

export interface BaseModel extends BaseGraphQLObject {
  id: ID_Output
  createdAt: DateTime
  createdById: String
  updatedAt?: DateTime | null
  updatedById?: String | null
  deletedAt?: DateTime | null
  deletedById?: String | null
  version: Int
}

export interface BaseModelUUID extends BaseGraphQLObject {
  id: ID_Output
  createdAt: DateTime
  createdById: String
  updatedAt?: DateTime | null
  updatedById?: String | null
  deletedAt?: DateTime | null
  deletedById?: String | null
  version: Int
}

export interface ExchangeStats {
  pair: String
  period: String
  intervalMinutes: Int
  minRate: Float
  maxRate: Float
  avgRate: Float
}

export interface LastExchange {
  pair: String
  fromAmount: String
  toAmount: String
  rate: Float
  timestamp: String
}

export interface LiquidityChange extends BaseGraphQLObject {
  id: ID_Output
  createdAt: DateTime
  createdById: String
  updatedAt?: DateTime | null
  updatedById?: String | null
  deletedAt?: DateTime | null
  deletedById?: String | null
  version: Int
  timestamp: BigInt
  blockNumber: Int
  eventIdx: Int
  step: Int
  reason: LiquidityChangeReason
  currencyZero: String
  currencyOne: String
  amountZero: BigInt
  amountOne: BigInt
  balanceZero: BigInt
  balanceOne: BigInt
}

export interface LiquidityChangeConnection {
  totalCount: Int
  edges: Array<LiquidityChangeEdge>
  pageInfo: PageInfo
}

export interface LiquidityChangeEdge {
  node: LiquidityChange
  cursor: String
}

export interface PageInfo {
  hasNextPage: Boolean
  hasPreviousPage: Boolean
  startCursor?: String | null
  endCursor?: String | null
}

export interface ProcessorState {
  lastCompleteBlock: Float
  lastProcessedEvent: String
  indexerHead: Float
  chainHead: Float
}

export interface StandardDeleteResponse {
  id: ID_Output
}

export interface Swap extends BaseGraphQLObject {
  id: ID_Output
  createdAt: DateTime
  createdById: String
  updatedAt?: DateTime | null
  updatedById?: String | null
  deletedAt?: DateTime | null
  deletedById?: String | null
  version: Int
  timestamp: BigInt
  blockNumber: Int
  eventIdx: Int
  step: Int
  fromCurrency: String
  toCurrency: String
  fromAmount: BigInt
  toAmount: BigInt
}

export interface SwapConnection {
  totalCount: Int
  edges: Array<SwapEdge>
  pageInfo: PageInfo
}

export interface SwapEdge {
  node: Swap
  cursor: String
}

/*
GraphQL representation of BigInt
*/
export type BigInt = string

/*
The `Boolean` scalar type represents `true` or `false`.
*/
export type Boolean = boolean

/*
The javascript `Date` as string. Type represents date and time as the ISO Date string.
*/
export type DateTime = Date | string

/*
The `Float` scalar type represents signed double-precision fractional values as specified by [IEEE 754](https://en.wikipedia.org/wiki/IEEE_floating_point).
*/
export type Float = number

/*
The `ID` scalar type represents a unique identifier, often used to refetch an object or as key for a cache. The ID type appears in a JSON response as a String; however, it is not intended to be human-readable. When expected as an input type, any string (such as `"4"`) or integer (such as `4`) input value will be accepted as an ID.
*/
export type ID_Input = string | number
export type ID_Output = string

/*
The `Int` scalar type represents non-fractional signed whole numeric values. Int can represent values between -(2^31) and 2^31 - 1.
*/
export type Int = number

/*
The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.
*/
export type String = string