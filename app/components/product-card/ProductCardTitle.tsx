import {useProductCardContext} from '@/components/product-card/ProductCard';
import {ComponentProps} from 'react';

type ProductCardTitleProps = ComponentProps<'div'>;

export default function ProductCardTitle(props: ProductCardTitleProps) {
  const {title} = useProductCardContext();
  return <div {...props}>{title}</div>;
}
