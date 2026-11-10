export interface ServiceGalleryCollection {
  serviceId: string;
  images: string[];
  featuredImage: string;
}

const optimizedRoot = "/images/gallery/services";
const imageSet = (folder: string, count: number) =>
  Array.from(
    { length: count },
    (_, index) => `${optimizedRoot}/${folder}/${folder}-${index + 1}.webp`
  );

export const serviceGalleryCollections: ServiceGalleryCollection[] = [
  {
    serviceId: "aroma-massage",
    images: imageSet("aroma", 6),
    featuredImage: `${optimizedRoot}/aroma/aroma-1.webp`
  },
  {
    serviceId: "thai-massage",
    images: imageSet("thai", 5),
    featuredImage: `${optimizedRoot}/thai/thai-1.webp`
  },
  {
    serviceId: "bamboo-massage",
    images: imageSet("bamboo", 5),
    featuredImage: `${optimizedRoot}/bamboo/bamboo-1.webp`
  },
  {
    serviceId: "herbal-massage",
    images: imageSet("herbal", 5),
    featuredImage: `${optimizedRoot}/herbal/herbal-1.webp`
  },
  {
    serviceId: "physical-therapy",
    images: imageSet("physical-therapy", 4),
    featuredImage: `${optimizedRoot}/physical-therapy/physical-therapy-1.webp`
  },
  {
    serviceId: "four-hand-massage",
    images: imageSet("four-hand", 5),
    featuredImage: `${optimizedRoot}/four-hand/four-hand-1.webp`
  },
  {
    serviceId: "foot-massage",
    images: imageSet("foot", 6),
    featuredImage: `${optimizedRoot}/foot/foot-1.webp`
  },
  {
    serviceId: "facial",
    images: imageSet("facial", 5),
    featuredImage: `${optimizedRoot}/facial/facial-1.webp`
  }
];

export const serviceGalleryImages = Object.fromEntries(
  serviceGalleryCollections.map(({ serviceId, images }) => [serviceId, images])
) as Record<string, string[]>;
