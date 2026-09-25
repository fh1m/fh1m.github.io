/**
 * Publications — real, verified. Fahim is a listed author on both.
 */

export interface Publication {
  slug: string;
  title: string;
  venue: string;
  year: string;
  authors: string;
  role: string;
  url: string;
  image?: string;
  tags: string[];
}

export const PUBLICATIONS: Publication[] = [
  {
    slug: 'color-is-class-evidence',
    title: 'Color is Also Class Evidence: Re-evaluating Domain Generalization for Underwater Object Detection',
    venue: 'OpenReview',
    year: '2025',
    authors: 'T. M. Wasif Ishmam, Yaad Kamrul Bari, Muhammad Fahim Faisal, Md Khalilur Rhaman',
    role: 'Advanced vision systems for AUVs — tested against the RoboSub 2025 / 2026 footage.',
    url: 'https://openreview.net/forum?id=qiFAySNAsW',
    tags: ['computer-vision', 'domain-generalization', 'underwater', 'object-detection'],
  },
  {
    slug: 'ecommerce-demand-clues',
    title: 'E-Commerce Recommendation System Based on Demand Clues',
    venue: 'Universe International Journal of Interdisciplinary Research, Vol. 4 Issue 11',
    year: '2024',
    authors: 'I. N. Reeve, T. Alam, M. Rahman Munia, A. Atif Showmik, M. F. Faisal',
    role: 'Recommendation systems to improve customer experience, with an international group of researchers.',
    url: 'https://uijir.com/wp-content/uploads/2024/04/17.14.-E-COMMERCE-RECOMMENDATION-SYSTEM-BASED-ON-DEMAND-CLUES.pdf',
    tags: ['recommender-systems', 'e-commerce', 'ml'],
  },
];
