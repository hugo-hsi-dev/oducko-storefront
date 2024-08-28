import {Link} from '@remix-run/react';
import {Image} from '@shopify/hydrogen';
import {ArrowRight} from 'lucide-react';
import {AllCollectionsQuery} from 'storefrontapi.generated';
// Make this a compound component
export default function CollectionItem({
  collection,
}: {
  collection: AllCollectionsQuery['collections']['nodes'][0];
}) {
  return (
    <Link
      className="relative aspect-square overflow-hidden group"
      key={collection.id}
      to={`/collections/${collection.handle}`}
      prefetch="intent"
    >
      {collection?.image && (
        <Image
          alt={collection.image.altText || collection.title}
          aspectRatio="1/1"
          data={collection.image}
          sizes="(min-width: 45em) 20vw, 50vw"
          className="absolute top-0 bottom-0 transition group-hover:scale-110 duration-300"
        />
      )}
      <div className="group-hover:bg-red-500  absolute top-5 right-5 transition duration-300">
        <ArrowRight
          size={50}
          className="group-hover:-rotate-45 group-hover:text-white transition duration-300"
        />
      </div>
      <h5 className="absolute bottom-10 left-10 z-10 text-6xl font-bold group-hover:text-red-500 transition duration-300">
        {collection.title}
      </h5>
    </Link>
  );
}
