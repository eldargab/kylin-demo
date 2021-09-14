import {Min} from "class-validator"
import {Arg, Field, Float, InputType, Int, ObjectType, Query, Resolver} from "type-graphql"
import {EntityManager} from "typeorm"
import {InjectManager} from "typeorm-typedi-extensions"


@ObjectType()
export class ExchangeStats {
    @Field(() => String, {nullable: false})
    pair!: string

    @Field(() => String, {nullable: false})
    period!: string // ISO string

    @Field(() => Int, {nullable: false})
    intervalMinutes!: number

    @Field(() => Float, {nullable: false})
    minRate!: number

    @Field(() => Float, {nullable: false})
    maxRate!: number

    @Field(() => Float, {nullable: false})
    avgRate!: number
}


@InputType()
export class ExchangeRatesInput {
    @Field(() => Int, {nullable: false})
    @Min(1)
    intervalMinutes!: number
}


@Resolver()
export class RatesResolver {
    constructor(@InjectManager() private db: EntityManager) {}

    @Query(() => [ExchangeStats])
    async exchangeRates(
        @Arg('params', {validate: true}) input: ExchangeRatesInput
    ): Promise<ExchangeStats[]> {
        let rows: any[] = await this.db.query(`
            select
                   round(timestamp / $1) * $1 as period,
                   concat(to_currency, '/', from_currency) as pair,
                   MIN(from_amount / to_amount) as min_rate,
                   MAX(from_amount / to_amount) as max_rate,
                   SUM(from_amount) / SUM(to_amount) as avg_rate
            from swap
            group by period, pair
            order by period DESC, pair
        `, [input.intervalMinutes * 60 * 1000])
        return rows.map(row => {
            let e = new ExchangeStats()
            e.pair = row.pair
            e.period = new Date(parseInt(row.period)).toISOString()
            e.intervalMinutes = input.intervalMinutes
            e.minRate = Number(row.min_rate)
            e.maxRate = Number(row.max_rate)
            e.avgRate = Number(row.avg_rate)
            return e
        })
    }
}
