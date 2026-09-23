export function isDateString(date: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(date);
}

export function isUUID(uuid: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(
    uuid,
  );
}
