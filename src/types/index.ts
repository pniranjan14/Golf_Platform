export interface Profile {
  id: string
  full_name: string | null
  avatar_url: string | null
  role: 'subscriber' | 'admin'
  charity_id: string | null
  charity_percent: number
  created_at: string
}


export interface Score {
  id: string
  user_id: string
  score: number
  score_date: string
  created_at: string
}

export interface Charity {
  id: string
  name: string
  description: string
  image_url: string | null
  website: string | null
  is_featured: boolean
  is_active: boolean
  created_at: string
}

export interface Draw {
  id: string;
  month: string;
  draw_date: string;
  winning_score: number;
  winners_count: number;
  total_prize_pool: string | number;
  participants_count: number;
  status: 'pending' | 'published';
  created_at: string;
}
