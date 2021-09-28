import {
  Arg,
  Args,
  Mutation,
  Query,
  Root,
  Resolver,
  FieldResolver,
  ObjectType,
  Field,
  Int,
  ArgsType,
  Info,
  Ctx,
} from 'type-graphql';
import graphqlFields from 'graphql-fields';
import { Inject } from 'typedi';
import { Min } from 'class-validator';
import {
  Fields,
  StandardDeleteResponse,
  UserId,
  PageInfo,
  RawFields,
  NestedFields,
  BaseContext,
} from '@subsquid/warthog';

import {
  LiquidityChangeCreateInput,
  LiquidityChangeCreateManyArgs,
  LiquidityChangeUpdateArgs,
  LiquidityChangeWhereArgs,
  LiquidityChangeWhereInput,
  LiquidityChangeWhereUniqueInput,
  LiquidityChangeOrderByEnum,
} from '../../warthog';

import { LiquidityChange } from './liquidity-change.model';
import { LiquidityChangeService } from './liquidity-change.service';

@ObjectType()
export class LiquidityChangeEdge {
  @Field(() => LiquidityChange, { nullable: false })
  node!: LiquidityChange;

  @Field(() => String, { nullable: false })
  cursor!: string;
}

@ObjectType()
export class LiquidityChangeConnection {
  @Field(() => Int, { nullable: false })
  totalCount!: number;

  @Field(() => [LiquidityChangeEdge], { nullable: false })
  edges!: LiquidityChangeEdge[];

  @Field(() => PageInfo, { nullable: false })
  pageInfo!: PageInfo;
}

@ArgsType()
export class ConnectionPageInputOptions {
  @Field(() => Int, { nullable: true })
  @Min(0)
  first?: number;

  @Field(() => String, { nullable: true })
  after?: string; // V3: TODO: should we make a RelayCursor scalar?

  @Field(() => Int, { nullable: true })
  @Min(0)
  last?: number;

  @Field(() => String, { nullable: true })
  before?: string;
}

@ArgsType()
export class LiquidityChangeConnectionWhereArgs extends ConnectionPageInputOptions {
  @Field(() => LiquidityChangeWhereInput, { nullable: true })
  where?: LiquidityChangeWhereInput;

  @Field(() => LiquidityChangeOrderByEnum, { nullable: true })
  orderBy?: [LiquidityChangeOrderByEnum];
}

@Resolver(LiquidityChange)
export class LiquidityChangeResolver {
  constructor(@Inject('LiquidityChangeService') public readonly service: LiquidityChangeService) {}

  @Query(() => [LiquidityChange])
  async liquidityChanges(
    @Args() { where, orderBy, limit, offset }: LiquidityChangeWhereArgs,
    @Fields() fields: string[]
  ): Promise<LiquidityChange[]> {
    return this.service.find<LiquidityChangeWhereInput>(where, orderBy, limit, offset, fields);
  }

  @Query(() => LiquidityChange, { nullable: true })
  async liquidityChangeByUniqueInput(
    @Arg('where') where: LiquidityChangeWhereUniqueInput,
    @Fields() fields: string[]
  ): Promise<LiquidityChange | null> {
    const result = await this.service.find(where, undefined, 1, 0, fields);
    return result && result.length >= 1 ? result[0] : null;
  }

  @Query(() => LiquidityChangeConnection)
  async liquidityChangesConnection(
    @Args() { where, orderBy, ...pageOptions }: LiquidityChangeConnectionWhereArgs,
    @Info() info: any
  ): Promise<LiquidityChangeConnection> {
    const rawFields = graphqlFields(info, {}, { excludedFields: ['__typename'] });

    let result: any = {
      totalCount: 0,
      edges: [],
      pageInfo: {
        hasNextPage: false,
        hasPreviousPage: false,
      },
    };
    // If the related database table does not have any records then an error is thrown to the client
    // by warthog
    try {
      result = await this.service.findConnection<LiquidityChangeWhereInput>(where, orderBy, pageOptions, rawFields);
    } catch (err: any) {
      console.log(err);
      // TODO: should continue to return this on `Error: Items is empty` or throw the error
      if (!(err.message as string).includes('Items is empty')) throw err;
    }

    return result as Promise<LiquidityChangeConnection>;
  }
}
