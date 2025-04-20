export interface User {
  created_at: string | null;
  email: string | null | undefined;
  email_verified: string | null;
  id: string;
  image: string | null;
  name: string | null;
  stripe_current_period_end: string | null;
  stripe_customer_id: string | null;
  stripe_price_id: string | null;
  stripe_subscription_id: string | null;
  updated_at: string | null;
}

export interface Category {
  id: string /* primary key */;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
  slug?: string;
}

export interface subCategory {
  id: string /* primary key */;
  name: string;
  category_id: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
}
