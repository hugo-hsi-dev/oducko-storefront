import {Link} from '@remix-run/react';
import {useOptimisticCart} from '@shopify/hydrogen';
import type {CartApiQueryFragment} from 'storefrontapi.generated';

import {CartLineItem} from '@/components/CartLineItem';
import {Separator} from '@/components/ui/separator';
import {CartSummary} from './CartSummary';

export type CartMainProps = {
  cart: CartApiQueryFragment | null;
};

/**
 * The main cart component that displays the cart items and summary.
 * It is used by both the /cart route and the cart aside dialog.
 */
export function CartMain({cart: originalCart}: CartMainProps) {
  // The useOptimisticCart hook applies pending actions to the cart
  // so the user immediately sees feedback when they modify the cart.
  const cart = useOptimisticCart(originalCart);

  const linesCount = Boolean(cart?.lines?.nodes?.length || 0);
  const withDiscount =
    cart &&
    Boolean(cart?.discountCodes?.filter((code) => code.applicable)?.length);
  const cartHasItems = cart?.totalQuantity! > 0;

  return (
    <div>
      <CartEmpty hidden={linesCount} />
      <div className="flex flex-col gap-2">
        <div aria-labelledby="cart-lines">
          <ul className="flex flex-col gap-2">
            {(cart?.lines?.nodes ?? []).map((line) => (
              <CartLineItem key={line.id} line={line} />
            ))}
          </ul>
        </div>
        <Separator />
        {cartHasItems && <CartSummary cart={cart} />}
      </div>
    </div>
  );
}

function CartEmpty({hidden = false}: {hidden: boolean}) {
  // const {close} = useAside();
  return (
    <div hidden={hidden}>
      <br />
      <p>
        Looks like you haven&rsquo;t added anything yet, let&rsquo;s get you
        started!
      </p>
      <br />
      <Link to="/collections" prefetch="viewport">
        Continue shopping →
      </Link>
    </div>
  );
}
