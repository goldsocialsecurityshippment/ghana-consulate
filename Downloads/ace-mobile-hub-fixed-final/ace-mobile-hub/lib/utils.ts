export const WHATSAPP_NUMBER = "233545420719";
export const PHONE_NUMBER = "0545420719";
export const BUSINESS_NAME = "Ace Mobile Hub";
export const BUSINESS_ADDRESS = "Accra Circle Mall, Ghana";
export const BUSINESS_HOURS = "Monday – Saturday: 9:00 AM – 7:00 PM\nSunday: 11:00 AM – 5:00 PM";

export function getWhatsAppLink(message?: string): string {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  if (message) {
    return `${base}?text=${encodeURIComponent(message)}`;
  }
  return base;
}

export function slugToTitle(slug: string): string {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
