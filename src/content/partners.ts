// Partner data lives in content/partners.json and is edited via the Keystatic admin at /keystatic.
import partnersData from "../../content/partners.json";

export type Partner = {
  name: string;
  website?: string;
  linkedin?: string;
  description: string;
  logo?: string;
};

export const partners: Partner[] = partnersData.partners;
