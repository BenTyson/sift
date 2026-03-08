-- Create tool_aliases table for improved deal-to-tool matching
CREATE TABLE tool_aliases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_id UUID NOT NULL REFERENCES tools(id) ON DELETE CASCADE,
  alias TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_tool_aliases_tool_id ON tool_aliases(tool_id);
CREATE INDEX idx_tool_aliases_alias ON tool_aliases(alias);
