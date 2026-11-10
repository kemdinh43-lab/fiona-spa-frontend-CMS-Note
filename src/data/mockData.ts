import type {
  BlogPost,
  CustomerReview,
  GalleryImage,
  ServiceCategory,
  SpaPackage,
  SpaService
} from "../shared/types/spa";

const img = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=82`;

export const brand = {
  name: "Fiona Massage & Spa",
  hotline: "+84 941333184",
  email: "customer@fionaspadanang.com",
  bookingEmail: "fionaspadn@gmail.com",
  phoneHref: "tel:+84941333184",
  address: "41 Ly Van To St, An Hai ward, Da Nang",
  openingHours: { opens: "09:00", closes: "23:30" },
  slogan: "Relax, refresh and glow in the heart of Da Nang.",
  mapUrl: "https://www.google.com/maps/place/Fiona+Spa+Da+Nang+(+Massage,+Shampoo,+Facials,+Nail,+Eyelash)/@16.0654914,108.2387873,16z/data=!3m1!4b1!4m6!3m5!1s0x314217002b06754d:0x1b6a22e5800c001d!8m2!3d16.0654914!4d108.2413622!16s%2Fg%2F11z63s1jb2",
  directionsUrl: "https://www.google.com/maps/dir/?api=1&destination=16.0654914%2C108.2413622",
  zaloUrl: "https://zalo.me/0941333184",
  whatsappUrl: "https://wa.me/84941333184",
  wechatUrl: "https://u.wechat.com/kIHQm-N42ANqvLuDsGQfTv8?s=2",
  facebookUrl: "https://www.facebook.com/fionaspadanang",
  instagramUrl: "https://www.instagram.com/fionaspa.danang",
  tiktokUrl: "https://www.tiktok.com/@fiona.spa.da.nang"
};

export const serviceCategories: ServiceCategory[] = [
  {
    id: "massage",
    name: "Massage",
    slug: "massage",
    description: "Signature massage therapies for tired bodies and busy minds.",
    imageUrl: img("photo-1519823551278-64ac92734fb1"),
    icon: "flower",
    sortOrder: 1
  },
  {
    id: "facials",
    name: "Facials",
    slug: "facials",
    description: "Hydrating facial care after sun, travel and city days.",
    imageUrl: img("photo-1570172619644-dfd03ed5d881"),
    icon: "sparkles",
    sortOrder: 2
  },
  {
    id: "foot",
    name: "Foot Care",
    slug: "foot-care",
    description: "Refresh your feet after walking Da Nang and My Khe beach.",
    imageUrl: img("photo-1519415510236-718bdfcd89c8"),
    icon: "footprints",
    sortOrder: 3
  },
  {
    id: "nails",
    name: "Nails",
    slug: "nails",
    description: "Clean manicures, pedicures and soft modern nail colors.",
    imageUrl: img("photo-1604654894610-df63bc536371"),
    icon: "paintbrush",
    sortOrder: 4
  },
  {
    id: "shampoo",
    name: "Shampoo",
    slug: "shampoo",
    description: "Scalp massage, relaxing wash and hair care ritual.",
    imageUrl: img("photo-1522337360788-8b13dee7a37e"),
    icon: "waves",
    sortOrder: 5
  },
  {
    id: "threading",
    name: "Threading",
    slug: "threading",
    description: "Gentle shaping for brows and facial details.",
    imageUrl: img("photo-1521590832167-7bcbfaa6381f"),
    icon: "scissors",
    sortOrder: 6
  },
  {
    id: "eyelash",
    name: "Eyelash",
    slug: "eyelash",
    description: "Natural lash lift and extension services.",
    imageUrl: img("photo-1516975080664-ed2fc6a32937"),
    icon: "eye",
    sortOrder: 7
  },
  {
    id: "wax",
    name: "Wax",
    slug: "wax",
    description: "Professional waxing with calm and careful service.",
    imageUrl: img("photo-1596178065887-1198b6148b2b"),
    icon: "badge",
    sortOrder: 8
  }
];

const benefits = ["Deep relaxation", "Reduce stress and travel fatigue", "Improve circulation", "Refresh body and mind"];
const process = ["Welcome tea", "Consultation", "Treatment ritual", "Relaxation time", "Aftercare advice"];

export const spaServices: SpaService[] = [
  {
    id: "fiona-signature-massage-60", categoryId: "massage", name: "Fiona Signature Massage", slug: "fiona-signature-massage",
    shortDescription: "A warm full-body massage to release tension and restore energy.",
    description: "Our signature treatment blends gentle pressure, warm oil and slow therapeutic movements for complete relaxation.",
    imageUrl: img("photo-1544161515-4ab6ce6db874"), durationMinutes: 60, priceVnd: 450000, priceUsd: 18, originalPriceVnd: 500000, discountPercent: 10, rating: 4.9, isFavorite: true, isActive: true, benefits, process
  },
  {
    id: "hot-stone-massage-75", categoryId: "massage", name: "Hot Stone Massage", slug: "hot-stone-massage",
    shortDescription: "Heated stone therapy for deeper muscle comfort.",
    description: "Smooth heated stones help relax muscles, ease stiffness and create a grounding spa experience.",
    imageUrl: img("photo-1600334129128-685c5582fd35"), durationMinutes: 75, priceVnd: 550000, priceUsd: 22, originalPriceVnd: 620000, discountPercent: 10, rating: 4.8, isFavorite: true, isActive: true, benefits, process
  },
  {
    id: "thai-massage-90", categoryId: "massage", name: "Thai Massage", slug: "thai-massage",
    shortDescription: "Stretching and pressure-point therapy for active travelers.",
    description: "A balanced Thai-style massage focused on flexibility, pressure points and total body renewal.",
    imageUrl: img("photo-1591343395902-1adcb454c4e2"), durationMinutes: 90, priceVnd: 650000, priceUsd: 26, originalPriceVnd: 760000, discountPercent: 15, rating: 4.8, isFavorite: true, isActive: true, benefits, process
  },
  {
    id: "facial-treatment-60", categoryId: "facials", name: "Hydrating Facial Treatment", slug: "facial-treatment",
    shortDescription: "Cleanse, hydrate and brighten skin after sunny days.",
    description: "A gentle facial including cleansing, exfoliation, mask, massage and hydration for a fresh glow.",
    imageUrl: img("photo-1570172619644-dfd03ed5d881"), durationMinutes: 60, priceVnd: 420000, priceUsd: 17, originalPriceVnd: 470000, discountPercent: 10, rating: 4.9, isFavorite: true, isActive: true, benefits, process
  }
];

// These content types are now managed by Google Sheets.
// Keep typed empty fallbacks so server-side normalization remains safe when a sheet is unavailable.
export const spaPackages: SpaPackage[] = [];
export const reviews: CustomerReview[] = [];
export const galleryImages: GalleryImage[] = [];
export const blogPosts: BlogPost[] = [];
