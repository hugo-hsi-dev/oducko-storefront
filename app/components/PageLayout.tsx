import {Link} from '@remix-run/react';
import type {
  CartApiQueryFragment,
  FooterQuery,
  HeaderQuery,
} from 'storefrontapi.generated';

import {Footer} from '@/components/Footer';
import {Header} from '@/components/Header';
import {
  SEARCH_ENDPOINT,
  SearchFormPredictive,
} from '@/components/SearchFormPredictive';
import {SearchResultsPredictive} from '@/components/SearchResultsPredictive';

interface PageLayoutProps {
  cart: Promise<CartApiQueryFragment | null>;
  footer: Promise<FooterQuery | null>;
  header: HeaderQuery;
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
  children?: React.ReactNode;
}

export function PageLayout({
  cart,
  children = null,
  footer,
  header,
  isLoggedIn,
  publicStoreDomain,
}: PageLayoutProps) {
  return (
    <>
      {header && (
        <Header
          header={header}
          cart={cart}
          isLoggedIn={isLoggedIn}
          publicStoreDomain={publicStoreDomain}
        />
      )}
      <main className="container mt-16">{children}</main>
      <Footer
        footer={footer}
        header={header}
        publicStoreDomain={publicStoreDomain}
      />
    </>
  );
}

function SearchAside() {
  return (
    <div className="predictive-search">
      <br />
      <SearchFormPredictive>
        {({fetchResults, goToSearch, inputRef}) => (
          <>
            <input
              name="q"
              onChange={fetchResults}
              onFocus={fetchResults}
              placeholder="Search"
              ref={inputRef}
              type="search"
            />
            &nbsp;
            <button onClick={goToSearch}>Search</button>
          </>
        )}
      </SearchFormPredictive>

      <SearchResultsPredictive>
        {({items, total, term, state, inputRef}) => {
          const {articles, collections, pages, products, queries} = items;

          if (state === 'loading' && term.current) {
            return <div>Loading...</div>;
          }

          if (!total) {
            return <SearchResultsPredictive.Empty term={term} />;
          }

          return (
            <>
              <SearchResultsPredictive.Queries
                queries={queries}
                inputRef={inputRef}
              />
              <SearchResultsPredictive.Products
                products={products}
                term={term}
              />
              <SearchResultsPredictive.Collections
                collections={collections}
                term={term}
              />
              <SearchResultsPredictive.Pages pages={pages} term={term} />
              <SearchResultsPredictive.Articles
                articles={articles}
                term={term}
              />
              {term.current && total ? (
                <Link to={`${SEARCH_ENDPOINT}?q=${term.current}`}>
                  <p>
                    View all results for <q>{term.current}</q>
                    &nbsp; →
                  </p>
                </Link>
              ) : null}
            </>
          );
        }}
      </SearchResultsPredictive>
    </div>
  );
}
