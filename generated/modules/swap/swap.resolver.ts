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
  SwapCreateInput,
  SwapCreateManyArgs,
  SwapUpdateArgs,
  SwapWhereArgs,
  SwapWhereInput,
  SwapWhereUniqueInput,
  SwapOrderByEnum,
} from '../../warthog';

import { Swap } from './swap.model';
import { SwapService } from './swap.service';

@ObjectType()
export class SwapEdge {
  @Field(() => Swap, { nullable: false })
  node!: Swap;

  @Field(() => String, { nullable: false })
  cursor!: string;
}

@ObjectType()
export class SwapConnection {
  @Field(() => Int, { nullable: false })
  totalCount!: number;

  @Field(() => [SwapEdge], { nullable: false })
  edges!: SwapEdge[];

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
export class SwapConnectionWhereArgs extends ConnectionPageInputOptions {
  @Field(() => SwapWhereInput, { nullable: true })
  where?: SwapWhereInput;

  @Field(() => SwapOrderByEnum, { nullable: true })
  orderBy?: [SwapOrderByEnum];
}

@Resolver(Swap)
export class SwapResolver {
  constructor(@Inject('SwapService') public readonly service: SwapService) {}

  @Query(() => [Swap])
  async swaps(@Args() { where, orderBy, limit, offset }: SwapWhereArgs, @Fields() fields: string[]): Promise<Swap[]> {
    return this.service.find<SwapWhereInput>(where, orderBy, limit, offset, fields);
  }

  @Query(() => Swap, { nullable: true })
  async swapByUniqueInput(@Arg('where') where: SwapWhereUniqueInput, @Fields() fields: string[]): Promise<Swap | null> {
    const result = await this.service.find(where, undefined, 1, 0, fields);
    return result && result.length >= 1 ? result[0] : null;
  }

  @Query(() => SwapConnection)
  async swapsConnection(
    @Args() { where, orderBy, ...pageOptions }: SwapConnectionWhereArgs,
    @Info() info: any
  ): Promise<SwapConnection> {
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
      result = await this.service.findConnection<SwapWhereInput>(where, orderBy, pageOptions, rawFields);
    } catch (err: any) {
      console.log(err);
      // TODO: should continue to return this on `Error: Items is empty` or throw the error
      if (!(err.message as string).includes('Items is empty')) throw err;
    }

    return result as Promise<SwapConnection>;
  }
}
