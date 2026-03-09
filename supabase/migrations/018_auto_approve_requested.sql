-- Add auto_approve_requested flag to businesses
-- When enabled, signals to the Astrevix team that the owner wants help reviewing submissions
ALTER TABLE businesses ADD COLUMN auto_approve_requested BOOLEAN DEFAULT FALSE;
