-- Profiles table (extends Supabase Auth users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Websites table
CREATE TABLE IF NOT EXISTS public.websites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  url TEXT NOT NULL,
  domain TEXT NOT NULL,
  name TEXT,
  is_active BOOLEAN DEFAULT true,
  last_audit_at TIMESTAMPTZ,
  last_audit_status TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT unique_user_domain UNIQUE(user_id, domain)
);

-- Audits table
CREATE TABLE IF NOT EXISTS public.audits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  website_id UUID REFERENCES public.websites ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'queued' CHECK (status IN ('queued', 'running', 'completed', 'partial', 'failed')),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  pass_count INT DEFAULT 0,
  warning_count INT DEFAULT 0,
  error_count INT DEFAULT 0
);

-- Audit Results table
CREATE TABLE IF NOT EXISTS public.audit_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  audit_id UUID REFERENCES public.audits ON DELETE CASCADE NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('technical', 'seo', 'crawlability', 'performance', 'security', 'infrastructure')),
  check_type TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('PASS', 'WARNING', 'ERROR', 'CRITICAL')),
  severity TEXT NOT NULL CHECK (severity IN ('critical', 'error', 'warning', 'passed')),
  title TEXT NOT NULL,
  message TEXT,
  technical_details JSONB,
  recommendation TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Links table (for broken links check)
CREATE TABLE IF NOT EXISTS public.links (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  audit_id UUID REFERENCES public.audits ON DELETE CASCADE NOT NULL,
  source_url TEXT NOT NULL,
  target_url TEXT NOT NULL,
  status_code INT,
  status TEXT CHECK (status IN ('ok', 'broken', 'redirect')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_websites_user_id ON public.websites(user_id);
CREATE INDEX IF NOT EXISTS idx_audits_website_id ON public.audits(website_id);
CREATE INDEX IF NOT EXISTS idx_audits_user_id ON public.audits(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_results_audit_id ON public.audit_results(audit_id);
CREATE INDEX IF NOT EXISTS idx_links_audit_id ON public.links(audit_id);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.websites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.links ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for websites
CREATE POLICY "Users can view own websites" ON public.websites
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own websites" ON public.websites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own websites" ON public.websites
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own websites" ON public.websites
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for audits
CREATE POLICY "Users can view own audits" ON public.audits
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own audits" ON public.audits
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for audit_results
CREATE POLICY "Users can view own audit results" ON public.audit_results
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.audits 
      WHERE audits.id = audit_results.audit_id 
      AND audits.user_id = auth.uid()
    )
  );

-- RLS Policies for links
CREATE POLICY "Users can view own links" ON public.links
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.audits 
      WHERE audits.id = links.audit_id 
      AND audits.user_id = auth.uid()
    )
  );

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function on user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS update_websites_updated_at ON public.websites;
CREATE TRIGGER update_websites_updated_at
  BEFORE UPDATE ON public.websites
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
