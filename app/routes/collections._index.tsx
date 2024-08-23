import CollectionGrid from '@/components/collections/CollectionGrid';
import {ALL_COLLECTIONS_QUERY} from '@/graphql/store/CollectionsQuery';
import {useLoaderData} from '@remix-run/react';
import {defer, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {AllCollectionsQuery} from 'storefrontapi.generated';

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
async function loadCriticalData({context, request}: LoaderFunctionArgs) {
  const [{collections}]: [AllCollectionsQuery] = await Promise.all([
    context.storefront.query(ALL_COLLECTIONS_QUERY),
    // Add other queries here, so that they are loaded in parallel
  ]);
  return {collections};
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context}: LoaderFunctionArgs) {
  return {};
}

export default function Collections() {
  const {collections} = useLoaderData<typeof loader>();
  return (
    <div className="collections">
      <h1 className="text-4xl font-bold">Collections</h1>
      <CollectionGrid collections={collections} />
    </div>
  );
}
