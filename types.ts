export interface GuitarAttribute {
  id: string;
  name: string;
  description: string;
  images?: string[]; // base64 encoded strings
  driveLinks?: (string | null)[]; // links for uploaded images
}