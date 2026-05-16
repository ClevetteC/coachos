-- foundation_data: replaces the 4 JSON files at project root
CREATE TABLE foundation_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  type text NOT NULL CHECK (type IN ('voice_profile','ica','offer_stack','credential_bank')),
  data jsonb NOT NULL DEFAULT '{"_placeholder":true}',
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, type)
);

-- setup_status: replaces setup-status.json
CREATE TABLE setup_status (
  user_id uuid PRIMARY KEY REFERENCES auth.users,
  tier text DEFAULT 'starter',
  onboarding_complete boolean DEFAULT false,
  percentage_complete integer DEFAULT 0,
  blocks_completed text[] DEFAULT '{}',
  owner_name text DEFAULT '',
  owner_brand text DEFAULT '',
  updated_at timestamptz DEFAULT now()
);

-- conversations: chat history grouping
CREATE TABLE conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  title text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- messages: individual chat turns
CREATE TABLE messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid REFERENCES conversations NOT NULL,
  role text NOT NULL CHECK (role IN ('user','assistant')),
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- prospects: replaces prospects/<slug>/ directories
CREATE TABLE prospects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  slug text NOT NULL,
  data jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, slug)
);

-- outcomes: replaces proposal-outcome.json and campaign/outcome.json
CREATE TABLE outcomes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  prospect_or_campaign text NOT NULL,
  output_type text NOT NULL,
  data jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Row-level security
ALTER TABLE foundation_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE setup_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE prospects ENABLE ROW LEVEL SECURITY;
ALTER TABLE outcomes ENABLE ROW LEVEL SECURITY;

-- RLS policies: users can only access their own rows
CREATE POLICY "users own foundation_data" ON foundation_data
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "users own setup_status" ON setup_status
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "users own conversations" ON conversations
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "users own messages" ON messages
  FOR ALL USING (
    auth.uid() = (
      SELECT user_id FROM conversations WHERE id = conversation_id
    )
  );

CREATE POLICY "users own prospects" ON prospects
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "users own outcomes" ON outcomes
  FOR ALL USING (auth.uid() = user_id);
