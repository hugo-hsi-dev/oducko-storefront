import {PRODUCT_ITEM_FRAGMENT} from '@/graphql/store/ProductsQuery';

export const ALL_COLLECTIONS_QUERY = `#graphql
fragment Collection on Collection {
  id
  title
  handle
  image {
    id
    url
    altText
    width
    height
  }
}

query AllCollections(
  $country: CountryCode
  $language: LanguageCode
) @inContext(country: $country, language: $language) {
  collections(first: 250) {  # 250 is the maximum number of collections you can fetch in one query
    nodes {
      ...Collection
    }
  }
}
` as const;

export const COLLECTION_QUERY = `#graphql
  ${PRODUCT_ITEM_FRAGMENT}
  query Collection(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      products(
        first: $first,
        last: $last,
        before: $startCursor,
        after: $endCursor
      ) {
        nodes {
          ...ProductItem
        }
        pageInfo {
          hasPreviousPage
          hasNextPage
          endCursor
          startCursor
        }
      }
    }
  }
` as const;
