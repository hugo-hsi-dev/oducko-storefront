import {useProductCardContext} from '@/components/product-card/ProductCardRoot';
import {Link} from '@remix-run/react';
import {ComponentProps} from 'react';

type ProductCardLinkProps = Omit<ComponentProps<typeof Link>, 'to'>;

export default function ProductCardLink({...props}: ProductCardLinkProps) {
  const {handle} = useProductCardContext();
  return <Link to={`/products/${handle}`} {...props} prefetch="intent" />;
}
