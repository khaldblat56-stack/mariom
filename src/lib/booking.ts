export const OPEN_BOOKING_FORM_EVENT = "booking-form:open";

export function openBookingForm() {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new Event(OPEN_BOOKING_FORM_EVENT));
}
