import {HeaderProps} from '@/components/Header';
import {Button} from '@/components/ui/button';
import {Await, NavLink} from '@remix-run/react';
import {CartViewPayload, useAnalytics} from '@shopify/hydrogen';
import {ShoppingBag} from 'lucide-react';
import {Suspense} from 'react';

import {CartMain} from '@/components/CartMain';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';

export function ViewCartButton({cart}: Pick<HeaderProps, 'cart'>) {
  return (
    <Suspense fallback={<CartHoverCard count={null} />}>
      <Await resolve={cart}>
        {(cart) => {
          if (!cart) return <CartHoverCard count={0} />;
          return <CartHoverCard count={cart.totalQuantity || 0} />;
        }}
      </Await>
    </Suspense>
  );
}

function CartHoverCard({count}: {count: number | null}) {
  const {publish, shop, cart, prevCart} = useAnalytics();

  function handleClick(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
    e.preventDefault();
    open('cart');
    publish('cart_viewed', {
      cart,
      prevCart,
      shop,
      url: window.location.href || '',
    } as CartViewPayload);
  }

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="ghost" size="icon" asChild>
          <NavLink to="/cart" onClick={handleClick} className="relative">
            <ShoppingBag size={16} />
            {count === null ? (
              ''
            ) : (
              <div className="w-5 h-5 rounded-full absolute top-0 right-0 flex justify-center items-center font-bold bg-accent-foreground text-accent text-xs">
                {count}
              </div>
            )}
          </NavLink>
        </Button>
      </HoverCardTrigger>
      <HoverCardContent align="end">
        <CartMain layout="aside" cart={cart} />
      </HoverCardContent>
    </HoverCard>
  );
}
