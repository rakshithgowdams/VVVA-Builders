/*
  # Reload PostgREST schema cache

  This migration forces PostgREST to reload its schema cache by issuing a
  NOTIFY pgrst, 'reload schema' signal. This resolves "Could not query the
  database for the schema cache" errors that occur after recent schema changes.
*/

NOTIFY pgrst, 'reload schema';
