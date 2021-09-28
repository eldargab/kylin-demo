import { createTypeUnsafe } from "@polkadot/types/create";
import { SubstrateEvent, SubstrateExtrinsic } from "@subsquid/hydra-common";
import { Codec } from "@polkadot/types/types";
import { typeRegistry } from ".";

import { AccountId, Balance } from "@polkadot/types/interfaces";
import { Vec } from "@polkadot/types";
import { CurrencyId } from "@acala-network/types/interfaces";

export namespace Dex {
  /**
   *  Use supply currency to swap target currency. \[trader, trading_path,
   *  liquidity_change_list\]
   *
   *  Event parameters: [AccountId, Vec<CurrencyId>, Vec<Balance>, ]
   */
  export class SwapEvent {
    public readonly expectedParamTypes = [
      "AccountId",
      "Vec<CurrencyId>",
      "Vec<Balance>",
    ];

    constructor(public readonly ctx: SubstrateEvent) {}

    get params(): [AccountId, Vec<CurrencyId>, Vec<Balance>] {
      return [
        createTypeUnsafe<AccountId & Codec>(typeRegistry, "AccountId", [
          this.ctx.params[0].value,
        ]),
        createTypeUnsafe<Vec<CurrencyId> & Codec>(
          typeRegistry,
          "Vec<CurrencyId>",
          [this.ctx.params[1].value]
        ),
        createTypeUnsafe<Vec<Balance> & Codec>(typeRegistry, "Vec<Balance>", [
          this.ctx.params[2].value,
        ]),
      ];
    }

    validateParams(): boolean {
      if (this.expectedParamTypes.length !== this.ctx.params.length) {
        return false;
      }
      let valid = true;
      this.expectedParamTypes.forEach((type, i) => {
        if (type !== this.ctx.params[i].type) {
          valid = false;
        }
      });
      return valid;
    }
  }

  /**
   *  Add liquidity success. \[who, currency_id_0, pool_0_increment,
   *  currency_id_1, pool_1_increment, share_increment\]
   *
   *  Event parameters: [AccountId, CurrencyId, Balance, CurrencyId, Balance, Balance, ]
   */
  export class AddLiquidityEvent {
    public readonly expectedParamTypes = [
      "AccountId",
      "CurrencyId",
      "Balance",
      "CurrencyId",
      "Balance",
      "Balance",
    ];

    constructor(public readonly ctx: SubstrateEvent) {}

    get params(): [
      AccountId,
      CurrencyId,
      Balance,
      CurrencyId,
      Balance,
      Balance
    ] {
      return [
        createTypeUnsafe<AccountId & Codec>(typeRegistry, "AccountId", [
          this.ctx.params[0].value,
        ]),
        createTypeUnsafe<CurrencyId & Codec>(typeRegistry, "CurrencyId", [
          this.ctx.params[1].value,
        ]),
        createTypeUnsafe<Balance & Codec>(typeRegistry, "Balance", [
          this.ctx.params[2].value,
        ]),
        createTypeUnsafe<CurrencyId & Codec>(typeRegistry, "CurrencyId", [
          this.ctx.params[3].value,
        ]),
        createTypeUnsafe<Balance & Codec>(typeRegistry, "Balance", [
          this.ctx.params[4].value,
        ]),
        createTypeUnsafe<Balance & Codec>(typeRegistry, "Balance", [
          this.ctx.params[5].value,
        ]),
      ];
    }

    validateParams(): boolean {
      if (this.expectedParamTypes.length !== this.ctx.params.length) {
        return false;
      }
      let valid = true;
      this.expectedParamTypes.forEach((type, i) => {
        if (type !== this.ctx.params[i].type) {
          valid = false;
        }
      });
      return valid;
    }
  }

  /**
   *  Remove liquidity from the trading pool success. \[who,
   *  currency_id_0, pool_0_decrement, currency_id_1, pool_1_decrement,
   *  share_decrement\]
   *
   *  Event parameters: [AccountId, CurrencyId, Balance, CurrencyId, Balance, Balance, ]
   */
  export class RemoveLiquidityEvent {
    public readonly expectedParamTypes = [
      "AccountId",
      "CurrencyId",
      "Balance",
      "CurrencyId",
      "Balance",
      "Balance",
    ];

    constructor(public readonly ctx: SubstrateEvent) {}

    get params(): [
      AccountId,
      CurrencyId,
      Balance,
      CurrencyId,
      Balance,
      Balance
    ] {
      return [
        createTypeUnsafe<AccountId & Codec>(typeRegistry, "AccountId", [
          this.ctx.params[0].value,
        ]),
        createTypeUnsafe<CurrencyId & Codec>(typeRegistry, "CurrencyId", [
          this.ctx.params[1].value,
        ]),
        createTypeUnsafe<Balance & Codec>(typeRegistry, "Balance", [
          this.ctx.params[2].value,
        ]),
        createTypeUnsafe<CurrencyId & Codec>(typeRegistry, "CurrencyId", [
          this.ctx.params[3].value,
        ]),
        createTypeUnsafe<Balance & Codec>(typeRegistry, "Balance", [
          this.ctx.params[4].value,
        ]),
        createTypeUnsafe<Balance & Codec>(typeRegistry, "Balance", [
          this.ctx.params[5].value,
        ]),
      ];
    }

    validateParams(): boolean {
      if (this.expectedParamTypes.length !== this.ctx.params.length) {
        return false;
      }
      let valid = true;
      this.expectedParamTypes.forEach((type, i) => {
        if (type !== this.ctx.params[i].type) {
          valid = false;
        }
      });
      return valid;
    }
  }
}
