import {HeaderProps} from '@/components/Header';
import {Button} from '@/components/ui/button';
import {Await, NavLink} from '@remix-run/react';
import {CartViewPayload, useAnalytics} from '@shopify/hydrogen';
import {ShoppingBag} from 'lucide-react';
import {
  createContext,
  PropsWithChildren,
  Suspense,
  useContext,
  useState,
} from 'react';

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
  const {open, setOpen} = useCartHoverCardContext();
  function handleClick(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
    e.preventDefault();
    publish('cart_viewed', {
      cart,
      prevCart,
      shop,
      url: window.location.href || '',
    } as CartViewPayload);
  }

  return (
    <HoverCard open={open} onOpenChange={setOpen}>
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
      <HoverCardContent
        align="end"
        className="flex flex-col gap-2 w-fit"
        sideOffset={25}
      >
        <div className="text-3xl font-bold">Cart</div>
        <Suspense fallback={<p>Loading cart ...</p>}>
          <Await resolve={cart}>
            {(cart) => {
              return <CartMain cart={cart} />;
            }}
          </Await>
        </Suspense>
      </HoverCardContent>
    </HoverCard>
  );
}

const CartHoverCardContext = createContext<{
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
} | null>(null);

export function useCartHoverCardContext() {
  const context = useContext(CartHoverCardContext);
  if (!context) {
    throw new Error('Must be used inside of CartHoverCardProvider');
  }
  return context;
}

export function CartHoverCardProvider({children}: PropsWithChildren) {
  const [open, setOpen] = useState(false);

  return (
    <CartHoverCardContext.Provider value={{open, setOpen}}>
      {children}
    </CartHoverCardContext.Provider>
  );
}
