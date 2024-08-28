import CollectionGrid from '@/components/collections/CollectionGrid';
import ProductCard from '@/components/product-card/ProductCard';
import {Button} from '@/components/ui/button';
import {ALL_COLLECTIONS_QUERY} from '@/graphql/store/CollectionsQuery';
import {PRODUCT_ITEM_FRAGMENT} from '@/graphql/store/ProductsQuery';
import {Await, useLoaderData, type MetaFunction} from '@remix-run/react';
import {Image} from '@shopify/hydrogen';
import {defer, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from 'framer-motion';
import {Suspense} from 'react';
import type {
  AllCollectionsQuery,
  FeaturedCollectionFragment,
  RecommendedProductQuery,
} from 'storefrontapi.generated';

export const meta: MetaFunction = () => {
  return [{title: 'Hydrogen | Home'}];
};

export async function loader(args: LoaderFunctionArgs) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return defer({...deferredData, ...criticalData});
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({context}: LoaderFunctionArgs) {
  const [{collections}] = await Promise.all([
    context.storefront.query(FEATURED_COLLECTION_QUERY),
    // Add other queries here, so that they are loaded in parallel
  ]);

  return {
    featuredCollection: collections.nodes[0],
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context}: LoaderFunctionArgs) {
  const recommendedProducts = context.storefront
    .query(RECOMMENDED_PRODUCTS_QUERY)
    .catch((error) => {
      // Log query errors, but don't throw them so the page can still render
      console.error(error);
      return null;
    });

  const collections = context.storefront
    .query(ALL_COLLECTIONS_QUERY)
    .catch((error) => {
      console.error(error);
      return null;
    });

  return {
    recommendedProducts,
    collections,
  };
}

export default function Homepage() {
  const data = useLoaderData<typeof loader>();
  return (
    <div className="home">
      <FeaturedCollection collection={data.featuredCollection} />
      <div className="relative z-10 bg-white">
        <RecommendedProducts products={data.recommendedProducts} />
        <AllCollections collections={data.collections} />
      </div>
      <div className="h-screen"></div>
    </div>
  );
}

function FeaturedCollection({
  collection,
}: {
  collection: FeaturedCollectionFragment;
}) {
  if (!collection) return null;
  const image = collection?.image;

  const {scrollY} = useScroll();

  useMotionValueEvent(scrollY, 'change', (latest) => {
    console.log('Page scroll: ', latest);
  });

  const headingOpacity = useTransform(scrollY, [0, 250], [1, 0]);

  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0]);

  const heroScale = useTransform(scrollY, [0, 1000], [1, 2]);

  return (
    <div className="grid grid-cols-2 gap-2 h-[90vh] sticky top-20">
      <div className="flex flex-col gap-12 justify-center">
        <motion.h1
          className="text-6xl font-bold text-balance tracking-tight"
          style={{opacity: headingOpacity}}
        >
          Make a new friend today!
        </motion.h1>
        <Button className="w-fit">Shop ODUCKO</Button>
      </div>
      {image && (
        <div className="flex items-center">
          <motion.div
            style={{originX: 1.01, scale: heroScale, opacity: heroOpacity}}
          >
            <Image
              data={image}
              width="50vw"
              sizes="(min-width: 45em) 50vw, 100vw"
            />
          </motion.div>
        </div>
      )}
    </div>
  );
}

function RecommendedProducts({
  products,
}: {
  products: Promise<RecommendedProductQuery | null>;
}) {
  return (
    <div className="relative bg-background flex items-center z-10">
      <div className="flex flex-col gap-2">
        <h2 className="text-4xl font-bold">Recommended Products</h2>
        <div>
          <Suspense fallback={<div>Loading...</div>}>
            <Await resolve={products}>
              {(response) => (
                <div className="flex gap-2">
                  {response
                    ? response.products.nodes.map((product, index) => (
                        <ProductCard product={product} key={product.id} />
                      ))
                    : null}
                </div>
              )}
            </Await>
          </Suspense>
        </div>
      </div>
    </div>
  );
}

function AllCollections({
  collections,
}: {
  collections: Promise<AllCollectionsQuery | null>;
}) {
  return (
    <div>
      <h2 className="text-4xl font-bold">Collections</h2>
      <div>
        <Suspense fallback={<div>Loading...</div>}>
          <Await resolve={collections}>
            {(response) => (
              <>
                {response ? (
                  <CollectionGrid collections={response['collections']} />
                ) : null}
              </>
            )}
          </Await>
        </Suspense>
      </div>
    </div>
  );
}

const FEATURED_COLLECTION_QUERY = `#graphql
  fragment FeaturedCollection on Collection {
    id
    title
    image {
      id
      url
      altText
      width
      height
    }
    handle
  }
  query FeaturedCollection($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 1, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...FeaturedCollection
      }
    }
  }
` as const;

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
${PRODUCT_ITEM_FRAGMENT}
  query RecommendedProduct ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 4, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...ProductItem
      }
    }
  }
` as const;
