import ProductCardImage from '@/components/product-card/ProductCardImage';
import ProductCardLink from '@/components/product-card/ProductCardLink';
import ProductCardPrice from '@/components/product-card/ProductCardPrice';
import ProductCardRoot from '@/components/product-card/ProductCardRoot';
import ProductCardTitle from '@/components/product-card/ProductCardTitle';
import {useState} from 'react';

import {motion} from 'framer-motion';
import {ProductItemFragment} from 'storefrontapi.generated';

type ProductCardProps = {
  product: ProductItemFragment;
};

export default function ProductCard({product}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <ProductCardRoot
      {...product}
      key={product.id}
      className="rounded overflow-hidden border p-2"
    >
      <ProductCardLink
        onMouseOver={() => setIsHovered(true)}
        onMouseOut={() => setIsHovered(false)}
      >
        {isHovered ? (
          <div className="h-[100px] flex justify-center items-center text-3xl font-bold pb-2">
            More Details
          </div>
        ) : null}

        <motion.div layout>
          <ProductCardImage />
        </motion.div>

        {!isHovered ? (
          <div className="h-[100px] pt-2">
            <ProductCardPrice className="text-2xl font-bold" />
            <ProductCardTitle className="text-lg font-semibold" />
          </div>
        ) : null}
      </ProductCardLink>
    </ProductCardRoot>
  );
}
