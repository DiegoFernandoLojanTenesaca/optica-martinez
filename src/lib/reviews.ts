import { createServerFn } from "@tanstack/react-start";

export type Review = { name: string; text: string; rating: number };
export type ReviewsPayload = {
  reviews: Review[];
  rating: number;
  total: number;
  live: boolean; // true si vienen de Google en vivo
};

// Reseñas reales actuales (fallback mientras no haya API key configurada)
const FALLBACK: Review[] = [
  {
    name: "Fernando Lojan",
    rating: 5,
    text: "Muy buena atención desde el primer momento. Fueron amables, pacientes y resolvieron todas mis dudas durante el examen visual. Me asesoraron muy bien en la elección de mis lentes.",
  },
  {
    name: "Maily Chamba",
    rating: 5,
    text: "Excelente servicio. El examen de vista fue muy completo y se nota que trabajan con tecnología de calidad. El personal es muy profesional.",
  },
  {
    name: "Carlos Severino",
    rating: 5,
    text: "La mejor óptica de Loja. Excelente servicio y atención.",
  },
  {
    name: "María Fernanda Correa",
    rating: 5,
    text: "La atención es increíble, te asesoran en todo y aclaran todas las dudas. Recomendadísimo.",
  },
];

/**
 * Trae reseñas de Google Places en vivo si están configuradas las env:
 *   GOOGLE_PLACES_API_KEY  y  GOOGLE_PLACE_ID
 * Si no, devuelve el fallback. Google devuelve hasta ~5 reseñas.
 */
export const getReviews = createServerFn({ method: "GET" }).handler(
  async (): Promise<ReviewsPayload> => {
    const key = process.env.GOOGLE_PLACES_API_KEY;
    const placeId = process.env.GOOGLE_PLACE_ID;

    if (!key || !placeId) {
      return { reviews: FALLBACK, rating: 5.0, total: 25, live: false };
    }

    try {
      const url =
        `https://maps.googleapis.com/maps/api/place/details/json` +
        `?place_id=${encodeURIComponent(placeId)}` +
        `&fields=reviews,rating,user_ratings_total` +
        `&reviews_sort=newest&language=es&key=${key}`;
      const res = await fetch(url);
      const data = (await res.json()) as {
        result?: {
          reviews?: { author_name: string; text: string; rating: number }[];
          rating?: number;
          user_ratings_total?: number;
        };
      };

      const reviews = (data.result?.reviews ?? [])
        .filter((r) => r.text?.trim())
        .map((r) => ({ name: r.author_name, text: r.text, rating: r.rating }));

      if (!reviews.length) {
        return { reviews: FALLBACK, rating: 5.0, total: 25, live: false };
      }

      return {
        reviews,
        rating: data.result?.rating ?? 5.0,
        total: data.result?.user_ratings_total ?? reviews.length,
        live: true,
      };
    } catch {
      return { reviews: FALLBACK, rating: 5.0, total: 25, live: false };
    }
  }
);
