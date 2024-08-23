import CollectionItem from '@/components/collections/CollectionItem';
import {cn} from '@/lib/utils';
import {HTMLAttributes} from 'react';
import {AllCollectionsQuery} from 'storefrontapi.generated';

type CollectionGridProps = HTMLAttributes<HTMLDivElement> & {
  collections: AllCollectionsQuery['collections'];
};
// TODO: make this a compouond component
export default function CollectionGrid({
  collections,
  className,
  ...props
}: CollectionGridProps) {
  return (
    <div className={cn('grid grid-cols-3', className)} {...props}>
      {collections
        ? collections.nodes.map((collection) => (
            <CollectionItem key={collection.id} collection={collection} />
          ))
        : null}
    </div>
  );
}
