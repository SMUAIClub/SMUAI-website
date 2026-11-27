// Homepage gallery + testimonials live in content/home.json and are edited via the Keystatic admin at /keystatic.
import homeData from "../../content/home.json";

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
};

export const heroGalleryImages: string[] = homeData.gallery;

export const testimonials: Testimonial[] = homeData.testimonials;
