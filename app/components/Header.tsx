import MobileSheet from '@/components/MobileSheet';
import SearchDialog from '@/components/SearchDialog';
import {Button} from '@/components/ui/button';
import {ViewCartButton} from '@/components/ViewCartButton';

import {Await, NavLink} from '@remix-run/react';
import {User} from 'lucide-react';
import {Suspense} from 'react';
import type {CartApiQueryFragment, HeaderQuery} from 'storefrontapi.generated';

export interface HeaderProps {
  header: HeaderQuery;
  cart: Promise<CartApiQueryFragment | null>;
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
}

export function Header({
  header,
  isLoggedIn,
  cart,
  publicStoreDomain,
}: HeaderProps) {
  const {shop, menu} = header;
  return (
    <header className="fixed top-0 left-0 right-0 py-3 z-10 bg-background">
      <div className="container flex justify-between">
        <div className="flex items-center gap-2">
          <MobileSheet
            isLoggedIn={isLoggedIn}
            header={header}
            publicStoreDomain={publicStoreDomain}
          />
          <NavLink prefetch="intent" to="/" end>
            <strong className="text-xl">{shop.name}</strong>
          </NavLink>
          <HeaderMenu
            menu={menu}
            primaryDomainUrl={header.shop.primaryDomain.url}
            publicStoreDomain={publicStoreDomain}
          />
        </div>
        <HeaderCtas isLoggedIn={isLoggedIn} cart={cart} />
      </div>
    </header>
  );
}

export function HeaderMenu({
  menu,
  primaryDomainUrl,
  publicStoreDomain,
}: {
  menu: HeaderProps['header']['menu'];
  primaryDomainUrl: HeaderProps['header']['shop']['primaryDomain']['url'];
  publicStoreDomain: HeaderProps['publicStoreDomain'];
}) {
  return (
    <nav className="hidden sm:flex gap-2" role="navigation">
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

function HeaderCtas({
  isLoggedIn,
  cart,
}: Pick<HeaderProps, 'isLoggedIn' | 'cart'>) {
  return (
    <nav className="flex" role="navigation">
      <SearchDialog />
      <NavLink prefetch="intent" to="/account" className="hidden sm:block">
        <Suspense
          fallback={
            <Button variant="ghost" size="icon">
              <User size={16} />
            </Button>
          }
        >
          <Await
            resolve={isLoggedIn}
            errorElement={
              <Button variant="ghost" size="icon">
                <User size={16} />
              </Button>
            }
          >
            {(isLoggedIn) =>
              isLoggedIn ? (
                'Account'
              ) : (
                <Button variant="ghost" size="icon">
                  <User size={16} />
                </Button>
              )
            }
          </Await>
        </Suspense>
      </NavLink>

      <ViewCartButton cart={cart} />
    </nav>
  );
}

export const FALLBACK_HEADER_MENU = {
  id: 'gid://shopify/Menu/199655587896',
  items: [
    {
      id: 'gid://shopify/MenuItem/461609500728',
      resourceId: null,
      tags: [],
      title: 'Collections',
      type: 'HTTP',
      url: '/collections',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609533496',
      resourceId: null,
      tags: [],
      title: 'Blog',
      type: 'HTTP',
      url: '/blogs/journal',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609566264',
      resourceId: null,
      tags: [],
      title: 'Policies',
      type: 'HTTP',
      url: '/policies',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609599032',
      resourceId: 'gid://shopify/Page/92591030328',
      tags: [],
      title: 'About',
      type: 'PAGE',
      url: '/pages/about',
      items: [],
    },
  ],
};
