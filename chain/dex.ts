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
}
