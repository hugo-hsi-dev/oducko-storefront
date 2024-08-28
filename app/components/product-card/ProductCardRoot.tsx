import {ComponentProps, useState} from 'react';

type ProductCardProps = ProductData & ComponentProps<'div'>;

import {createContext, useContext} from 'react';
import {ProductItemFragment} from 'storefrontapi.generated';

export type ProductData = ProductItemFragment;

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

export default function ProductCardRoot({
  id,
  handle,
  featuredImage,
  priceRange,
  title,
  ...props
}: ProductCardProps) {
  const [state, setState] = useState();
  return (
    <ProductCardContext.Provider
      value={{id, handle, featuredImage, priceRange, title}}
    >
      <div {...props} />
    </ProductCardContext.Provider>
  );
}
