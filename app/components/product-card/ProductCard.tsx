import {ComponentProps, useState} from 'react';

type ProductCardProps = ProductData & ComponentProps<'div'>;

import {createContext, useContext} from 'react';
import {RecommendedProductsQuery} from 'storefrontapi.generated';

export type ProductData = RecommendedProductsQuery['products']['nodes'][0];

const ProductCardContext = createContext<ProductData | null>(null);

export function useProductCardContext() {
  const context = useContext(ProductCardContext);
  if (!context) {
    throw new Error(
      'ProductCard components must be used inside of ProductCard Root Component',
    );
  }
  return context;
}

export default function ProductCard({
  id,
  handle,
  images,
  priceRange,
  title,
  ...props
}: ProductCardProps) {
  const [state, setState] = useState();

  return (
    <ProductCardContext.Provider
      value={{id, handle, images, priceRange, title}}
    >
      <div {...props} />
    </ProductCardContext.Provider>
  );
}
