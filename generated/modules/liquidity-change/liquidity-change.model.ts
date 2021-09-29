import { BaseModel, IntField, NumericField, Model, EnumField, StringField, JSONField } from '@subsquid/warthog';

import BN from 'bn.js';

import * as jsonTypes from '../jsonfields/jsonfields.model';

import { LiquidityChangeReason } from '../enums/enums';
export { LiquidityChangeReason };

@Model({ api: {} })
export class LiquidityChange extends BaseModel {
  @NumericField({
    transformer: {
      to: (entityValue: BN) => (entityValue !== undefined ? entityValue.toString(10) : null),
      from: (dbValue: string) =>
        dbValue !== undefined && dbValue !== null && dbValue.length > 0 ? new BN(dbValue, 10) : undefined,
    },
  })
  timestamp!: BN;

  @IntField({})
  blockNumber!: number;

  @IntField({})
  eventIdx!: number;

  @EnumField('LiquidityChangeReason', LiquidityChangeReason, {})
  reason!: LiquidityChangeReason;

  @StringField({})
  currencyZero!: string;

  @NumericField({
    transformer: {
      to: (entityValue: BN) => (entityValue !== undefined ? entityValue.toString(10) : null),
      from: (dbValue: string) =>
        dbValue !== undefined && dbValue !== null && dbValue.length > 0 ? new BN(dbValue, 10) : undefined,
    },
  })
  balanceZero!: BN;

  @StringField({})
  currencyOne!: string;

  @NumericField({
    transformer: {
      to: (entityValue: BN) => (entityValue !== undefined ? entityValue.toString(10) : null),
      from: (dbValue: string) =>
        dbValue !== undefined && dbValue !== null && dbValue.length > 0 ? new BN(dbValue, 10) : undefined,
    },
  })
  balanceOne!: BN;

  constructor(init?: Partial<LiquidityChange>) {
    super();
    Object.assign(this, init);
  }
}
