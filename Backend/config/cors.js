const localDevOriginPattern = /^http:\/\/(localhost|127\.0\.0\.1):517\d$/;

export function getAllowedOrigins() {
  const envOrigins = process.env.FRONTEND_URLS
    ?.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  return envOrigins && envOrigins.length > 0
    ? envOrigins
    : ["http://localhost:5173", "http://localhost:5174"];
}

export function isAllowedOrigin(origin) {
  if (!origin) return true;
  return getAllowedOrigins().includes(origin) || localDevOriginPattern.test(origin);
}

export const corsOptions = {
  origin(origin, cb) {
    if (isAllowedOrigin(origin)) return cb(null, true);
    return cb(new Error(`CORS blocked origin: ${origin}`));
  },
  credentials: true,
};
