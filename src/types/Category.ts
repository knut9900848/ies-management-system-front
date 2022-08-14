interface Category {
  id: number;
  name: string;
  code: string;
  is_active: boolean;
  description: string;
}

interface SubCategory {
  id: number;
  name: string;
  code: string;
  is_active: boolean;
  description: string;
  category_id: number;
}

export type { Category, SubCategory };
