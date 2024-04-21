import { PlaceImage } from "./place-image";

export interface PlaceData {
  id: string;
  name: string;
  type: string;
  description: string;
  latitude: number;
  longitude: number;
  placeImages?: PlaceImage[];
  tags?: string[];
  restrictions?: string[];
  averageRating?: number;
  address: string;
  zip: string;
  town: string;
  website: string;
  phone: string;
  favorite: boolean;
}