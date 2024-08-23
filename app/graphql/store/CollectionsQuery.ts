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
