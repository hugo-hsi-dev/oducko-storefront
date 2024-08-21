import {FALLBACK_HEADER_MENU, HeaderProps} from '@/components/Header';
import {Button} from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {Await, NavLink} from '@remix-run/react';
import {Menu} from 'lucide-react';
import {Suspense} from 'react';

type MobileSheetProps = Pick<HeaderProps, 'isLoggedIn'> & {
  header: HeaderProps['header'];
  publicStoreDomain: string;
};

export default function MobileSheet({
  isLoggedIn,
  header,
  publicStoreDomain,
}: MobileSheetProps) {
  const {shop, menu} = header;
  return (
    <Sheet>
      <SheetTrigger className="block sm:hidden">
        <Menu />
      </SheetTrigger>
      <SheetContent side="left" className="flex flex-col justify-between">
        <SheetHeader>
          <SheetTitle className="text-left">{shop.name}</SheetTitle>
        </SheetHeader>

        <HeaderMenu
          menu={menu}
          primaryDomainUrl={shop.primaryDomain.url}
          publicStoreDomain={publicStoreDomain}
        />

        {/* TODO: style this better and make link only on button instead of div */}
        <SheetFooter className="border-t pt-2">
          <NavLink prefetch="intent" to="/account">
            <Suspense fallback={<SignInButton />}>
              <Await resolve={isLoggedIn} errorElement={<SignInButton />}>
                {(isLoggedIn) =>
                  isLoggedIn ? (
                    <Button variant="outline" className="w-full">
                      Account
                    </Button>
                  ) : (
                    <SignInButton />
                  )
                }
              </Await>
            </Suspense>
          </NavLink>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

function HeaderMenu({
  menu,
  primaryDomainUrl,
  publicStoreDomain,
}: {
  menu: HeaderProps['header']['menu'];
  primaryDomainUrl: HeaderProps['header']['shop']['primaryDomain']['url'];
  publicStoreDomain: HeaderProps['publicStoreDomain'];
}) {
  return (
    <nav className="flex flex-col gap-2" role="navigation">
      <NavLink end prefetch="intent" to="/">
        Home
      </NavLink>

      {(menu || FALLBACK_HEADER_MENU).items.map((item) => {
        if (!item.url) return null;

        // if the url is internal, we strip the domain
        const url =
          item.url.includes('myshopify.com') ||
          item.url.includes(publicStoreDomain) ||
          item.url.includes(primaryDomainUrl)
            ? new URL(item.url).pathname
            : item.url;
        return (
          <NavLink end key={item.id} prefetch="intent" to={url}>
            {item.title}
          </NavLink>
        );
      })}
    </nav>
  );
}

function SignInButton() {
  return (
    <div className="flex flex-col gap-2">
      <div>Signing in will make oducko happy!</div>

      <Button variant="outline" className="w-full">
        Sign In
      </Button>
    </div>
  );
}
