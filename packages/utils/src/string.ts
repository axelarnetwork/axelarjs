export const isNilOrWhitespace = (
  value: string | undefined | null
): value is undefined | null => (value?.trim() ?? "") === "";

export const capitalize = (value: string) =>
  value.charAt(0).toUpperCase().concat(value.slice(1));

export const sluggify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

export const unSluggify = (value: string) =>
  value.split("-").map(capitalize).join(" ");
