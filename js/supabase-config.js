// Supabase — configuración del panel admin + lectura pública.
// CÓMO CONSEGUIR ESTOS 2 VALORES (2 minutos):
//   Supabase > tu proyecto > Settings > API >
//   - Project URL  -> pégala en supabaseUrl
//   - anon public  -> pégala en supabaseAnonKey
// Mientras estén con "PEGAR_AQUI" el admin funciona en MODO DEMO local
// (guarda en localStorage, sin servidor) para que puedas probar el formulario.

const SUPABASE_CONFIG = {
  supabaseUrl: "https://fuhwkgcjqbkwkoswvigo.supabase.co",
  supabaseAnonKey: "sb_publishable_ysP-BeYB7x6Qy_HJyXc6oQ_2hz_qf8T"
};

const isSupabaseConfigured = () => {
  return (
    SUPABASE_CONFIG.supabaseUrl.startsWith("http") &&
    SUPABASE_CONFIG.supabaseAnonKey !== "PEGAR_AQUI_ANON_KEY"
  );
};
