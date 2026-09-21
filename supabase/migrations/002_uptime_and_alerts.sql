-- Uptime checks table
CREATE TABLE IF NOT EXISTS public.uptime_checks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  website_id UUID REFERENCES public.websites ON DELETE CASCADE NOT NULL,
  status_code INT,
  response_time_ms INT,
  is_up BOOLEAN NOT NULL,
  error_message TEXT,
  checked_at TIMESTAMPTZ DEFAULT NOW()
);

-- Alerts table for downtime / incidents
CREATE TABLE IF NOT EXISTS public.alerts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  website_id UUID REFERENCES public.websites ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('downtime', 'recovery', 'slow_response')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  status_code INT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for fast querying
CREATE INDEX IF NOT EXISTS idx_uptime_checks_website_id ON public.uptime_checks(website_id);
CREATE INDEX IF NOT EXISTS idx_uptime_checks_checked_at ON public.uptime_checks(checked_at DESC);
CREATE INDEX IF NOT EXISTS idx_alerts_user_id ON public.alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_alerts_website_id ON public.alerts(website_id);
CREATE INDEX IF NOT EXISTS idx_alerts_created_at ON public.alerts(created_at DESC);

-- Enable RLS
ALTER TABLE public.uptime_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;

-- RLS for uptime_checks
CREATE POLICY "Users can view uptime checks of their websites" ON public.uptime_checks
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.websites
      WHERE websites.id = uptime_checks.website_id
      AND websites.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert uptime checks for their websites" ON public.uptime_checks
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.websites
      WHERE websites.id = uptime_checks.website_id
      AND websites.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete uptime checks for their websites" ON public.uptime_checks
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.websites
      WHERE websites.id = uptime_checks.website_id
      AND websites.user_id = auth.uid()
    )
  );

-- RLS for alerts
CREATE POLICY "Users can view own alerts" ON public.alerts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own alerts" ON public.alerts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own alerts" ON public.alerts
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own alerts" ON public.alerts
  FOR INSERT WITH CHECK (auth.uid() = user_id);
