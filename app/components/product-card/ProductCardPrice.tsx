import {useProductCardContext} from '@/components/product-card/ProductCard';
import {ComponentProps} from 'react';

type ProductCardPriceProps = ComponentProps<'div'>;

export default function ProductCardPrice(props: ProductCardPriceProps) {
  const {priceRange} = useProductCardContext();
  return <div {...props}>${priceRange.minVariantPrice.amount}</div>;
}
