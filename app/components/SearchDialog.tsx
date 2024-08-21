import {
  SEARCH_ENDPOINT,
  SearchFormPredictive,
} from '@/components/SearchFormPredictive';
import {SearchResultsPredictive} from '@/components/SearchResultsPredictive';
import {Button} from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog';
import {ScrollArea} from '@/components/ui/scroll-area';
import {Separator} from '@/components/ui/separator';
import {Link} from '@remix-run/react';
import {Search} from 'lucide-react';

export default function SearchDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="reset" size="icon" variant="ghost">
          <Search size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] gap-0 p-0" closeButton={false}>
        <SearchFormPredictive>
          {({fetchResults, goToSearch, inputRef}) => (
            <>
              <div className="p-2 pl-4 flex gap-2 items-center border-b">
                <Search size={16} />
                <input
                  name="q"
                  className="w-full outline-none"
                  onChange={fetchResults}
                  onFocus={fetchResults}
                  placeholder="Search"
                  ref={inputRef}
                />

                <DialogClose className="bg-primary text-primary-foreground text-xs p-1 px-2 rounded">
                  ESC
                </DialogClose>
              </div>
              {/* <button onClick={goToSearch}>Search</button> */}
            </>
          )}
        </SearchFormPredictive>

        <SearchResultsPredictive>
          {({items, total, term, state, inputRef}) => {
            const {articles, collections, pages, products, queries} = items;

            if (state === 'loading' && term.current) {
              return <div className="p-6">Loading...</div>;
            }

            if (!total) {
              return <SearchResultsPredictive.Empty term={term} />;
            }

            return (
              <>
                <ScrollArea className="p-6 max-h-[300px]">
                  {/* TODO: adds possible search terms to the dialog */}
                  {/* <SearchResultsPredictive.Queries
                    queries={queries}
                    inputRef={inputRef}
                  /> */}
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
                </ScrollArea>
                <Separator />
                <div className="px-6 py-2">
                  {term.current && total ? (
                    <Link to={`${SEARCH_ENDPOINT}?q=${term.current}`}>
                      <p>
                        View all results for <q>{term.current}</q>
                        &nbsp; →
                      </p>
                    </Link>
                  ) : null}
                </div>
              </>
            );
          }}
        </SearchResultsPredictive>
      </DialogContent>
    </Dialog>
  );
}
