import { Navigate, Route, Routes } from "react-router-dom";
import { AboutPage } from "../features/about/pages/AboutPage";
import { BlogDetailPage } from "../features/blog/pages/BlogDetailPage";
import { BlogPage } from "../features/blog/pages/BlogPage";
import { BookingPage } from "../features/booking/pages/BookingPage";
import { ContactPage } from "../features/contact/pages/ContactPage";
import { GalleryPage } from "../features/gallery/pages/GalleryPage";
import { HomePage } from "../features/home/pages/HomePage";
import { PackagesPage } from "../features/packages/pages/PackagesPage";
import { NotFoundPage } from "../features/not-found/pages/NotFoundPage";
import { ServiceDetailPage } from "../features/services/pages/ServiceDetailPage";
import { ServicesPage } from "../features/services/pages/ServicesPage";
import { RootLocaleRedirect } from "../shared/components/RootLocaleRedirect";
import { MainLayout } from "../shared/layouts/MainLayout";
import { LocaleRoute } from "../shared/layouts/LocaleRoute";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<RootLocaleRedirect />} />
      <Route path=":locale" element={<LocaleRoute />}>
        <Route element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="services" element={<ServicesPage />} />
          <Route path="services/:slug" element={<ServiceDetailPage />} />
          <Route path="packages" element={<PackagesPage />} />
          <Route path="booking" element={<BookingPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="gallery" element={<GalleryPage />} />
          <Route path="blog" element={<BlogPage />} />
          <Route path="blog/:slug" element={<BlogDetailPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/en" replace />} />
    </Routes>
  );
}
