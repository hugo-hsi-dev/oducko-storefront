import {useProductCardContext} from '@/components/product-card/ProductCardRoot';
import {Image} from '@shopify/hydrogen';
import {ComponentProps} from 'react';

type ProductCardImageProps = ComponentProps<typeof Image>;

export default function ProductCardImage({...props}: ProductCardImageProps) {
  const {featuredImage} = useProductCardContext();
  return featuredImage ? (
    <Image sizes="50vw" data={featuredImage} {...props} />
  ) : null;
}
