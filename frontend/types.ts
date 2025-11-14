// Types defined across whole frontend
export interface card {
  id: number;
  name: string;
  set_name: string;
  rarity: string;
  price: number;
  print_description?: string;
  image_url: string;
  owner_id: number;
  owner: string;
  quantity: number;
  intent: "have" | "want";
}