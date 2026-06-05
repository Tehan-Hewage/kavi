export function getUpcomingOccasion(): string {
  const date = new Date();
  const month = date.getMonth() + 1; // 1-12
  const day = date.getDate();

  // Sri Lankan occasion awareness
  if (month === 4) {
    return "Sinhala and Tamil New Year (Avurudu)";
  }
  if (month === 5) {
    return "Vesak Festival";
  }
  if (month === 6) {
    return "Poson Poya";
  }
  if (month === 12) {
    return "Christmas";
  }
  if (month === 2 && day <= 14) {
    return "Valentine's Day";
  }
  return "Mother's Day"; // default fallback or general gift season
}
