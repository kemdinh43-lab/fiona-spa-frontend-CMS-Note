export interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  icon: string;
  sortOrder: number;
}

export interface SpaService {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  imageUrl: string;
  imageFallback?: string;
  durationMinutes?: number;
  priceVnd: number;
  priceUsd?: number;
  priceFromVnd?: number;
  priceFromUsd?: number;
  originalPriceVnd?: number;
  discountPercent?: number;
  rating: number;
  isFavorite: boolean;
  isActive: boolean;
  benefits: string[];
  process: string[];
  badge?: string;
  notes?: string;
  seoTitle?: string;
  seoDescription?: string;
}

export interface BrandInfo {
  name: string;
  hotline: string;
  email: string;
  bookingEmail: string;
  phoneHref: string;
  address: string;
  openingHours: {
    opens: string;
    closes: string;
  };
  slogan: string;
  mapUrl: string;
  directionsUrl: string;
  zaloUrl: string;
  whatsappUrl: string;
  wechatUrl: string;
  facebookUrl: string;
  instagramUrl: string;
  tiktokUrl: string;
}

export interface SpaPackage {
  id: string;
  name: string;
  slug: string;
  shortDescription?: string;
  description: string;
  serviceIds: string[];
  includedItems?: string[];
  durationMinutes: number;
  originalPriceVnd: number;
  salePriceVnd: number;
  imageUrl: string;
  imageFallback?: string;
  isFeatured: boolean;
  isActive?: boolean;
  notes?: string;
  seoTitle?: string;
  seoDescription?: string;
}

export interface BookingRequest {
  fullName: string;
  phoneNumber?: string;
  facebook?: string;
  email?: string;
  serviceId?: string;
  serviceName: string;
  durationMinutes?: number;
  numberOfPeople: number;
  arrivalDate: string;
  arrivalTime?: string;
  note?: string;
}

export interface CustomerReview {
  id: string;
  customerName: string;
  country?: string;
  rating: number;
  content: string;
  source: "GOOGLE" | "TRIPADVISOR" | "FACEBOOK" | "WEBSITE";
  createdAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  imageFallback?: string;
  category: string;
  author: string;
  publishedAt: string;
  translations?: Partial<Record<LanguageCode, BlogTranslationFields>>;
}

export interface GalleryImage {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  imageFallback?: string;
  mediaType?: "image" | "video";
  videoUrl?: string;
  driveFolderUrl?: string;
  useInGallery?: boolean;
  useInTreatmentGallery?: boolean;
  serviceId?: string;
  gallerySortOrder?: number;
  treatmentSortOrder?: number;
  translations?: Partial<Record<LanguageCode, GalleryTranslationFields>>;
}

export type LanguageCode = "en" | "vi" | "ko" | "zh-CN";

export type TranslationDictionary = Record<LanguageCode, Record<string, string>>;

export interface BlogTranslationFields {
  title?: string;
  excerpt?: string;
  content?: string;
  category?: string;
}

export interface GalleryTranslationFields {
  title?: string;
  category?: string;
}

export interface ServiceTranslationFields {
  name?: string;
  shortDescription?: string;
  description?: string;
  benefits?: string[];
  process?: string[];
  seoTitle?: string;
  seoDescription?: string;
  badge?: string;
  includedItems?: string[];
  notes?: string;
}

export type ServiceTranslations = Record<
  string,
  Partial<Record<LanguageCode, ServiceTranslationFields>>
>;

export interface ImageResource {
  imageUrl: string;
  imageFallback: string;
}

export type ImageResources = Record<string, ImageResource>;

export interface SiteContentResponse {
  brand: BrandInfo;
  serviceCategories: ServiceCategory[];
  spaServices: SpaService[];
  spaPackages: SpaPackage[];
  reviews: CustomerReview[];
  galleryImages: GalleryImage[];
  blogPosts: BlogPost[];
  imageResources: ImageResources;
  translations: TranslationDictionary;
  serviceTranslations: ServiceTranslations;
  source: "google-sheets" | "fallback";
  updatedAt: string;
}
