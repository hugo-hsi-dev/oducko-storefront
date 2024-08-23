import {useProductCardContext} from '@/components/product-card/ProductCard';
import {Image} from '@shopify/hydrogen';
import {ComponentProps} from 'react';

type ProductCardImageProps = ComponentProps<typeof Image>;

export default function ProductCardImage({...props}: ProductCardImageProps) {
  const {images} = useProductCardContext();
  const data = images.nodes[0];
  return <Image data={data} {...props} />;
}
