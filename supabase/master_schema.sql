-- MASTER INITIALIZATION SCRIPT
-- RUN THIS IN THE SUPABASE SQL EDITOR

-- 1. Create PUBLIC.CHARITIES table
CREATE TABLE IF NOT EXISTS public.charities (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    website TEXT,
    is_featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Create PUBLIC.PROFILES table (Linked to Auth.Users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT,
    avatar_url TEXT,
    role TEXT DEFAULT 'subscriber' CHECK (role IN ('subscriber', 'admin')),
    charity_id TEXT REFERENCES public.charities(id),
    charity_percent INTEGER DEFAULT 10,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Create PUBLIC.SCORES table
CREATE TABLE IF NOT EXISTS public.scores (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
    score_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Create PUBLIC.DRAWS table
CREATE TABLE IF NOT EXISTS public.draws (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    month TEXT NOT NULL,
    draw_date TIMESTAMPTZ NOT NULL,
    winning_score INTEGER NOT NULL,
    winners_count INTEGER DEFAULT 0,
    total_prize_pool NUMERIC(12,2) DEFAULT 0.00,
    participants_count INTEGER DEFAULT 0,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'published')),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Create PUBLIC.SUBSCRIPTIONS table
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT,
    plan TEXT,
    status TEXT,
    current_period_start TIMESTAMPTZ,
    current_period_end TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Create PUBLIC.CHARITY_CONTRIBUTIONS table
CREATE TABLE IF NOT EXISTS public.charity_contributions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    charity_id TEXT REFERENCES public.charities(id),
    amount NUMERIC(10,2) NOT NULL,
    percentage_used INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.draws ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.charities ENABLE ROW LEVEL SECURITY;

-- 8. RLS POLICIES (Simplified for initial setup)
-- Profiles: Users can read/write their own profile
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Scores: Users can manage their own scores
CREATE POLICY "Users can view own scores" ON public.scores FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own scores" ON public.scores FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own scores" ON public.scores FOR DELETE USING (auth.uid() = user_id);

-- Public Data: Everyone can view charities and published draws
CREATE POLICY "Anyone can view charities" ON public.charities FOR SELECT USING (true);
CREATE POLICY "Anyone can view published draws" ON public.draws FOR SELECT USING (true);

-- 9. AUTOMATION: Create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, role)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url', 'subscriber');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 10. SEED DATA: CHARITIES
INSERT INTO public.charities (id, name, description, is_featured) VALUES
('char_1', 'Green Fairways Foundation', 'Supporting sustainable golf courses and local ecology.', true),
('char_2', 'Junior Golfers Initiative', 'Helping underprivileged youth access the game of golf.', false),
('char_3', 'Veterans Golf Retreat', 'Providing therapy and community through golf for our veterans.', true),
('char_4', 'Cancer Research UK', 'Funding life-saving research to beat cancer.', true),
('char_5', 'Ocean Clean Up', 'Removing plastic waste from our oceans and waterways.', false),
('char_6', 'Blind Golf Association', 'Enabling visually impaired athletes to compete at the highest level.', false)
ON CONFLICT (id) DO NOTHING;
