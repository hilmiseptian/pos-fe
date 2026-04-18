const required = ['VITE_API_PATH'];
required.forEach((key) => {
  if (!import.meta.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
});
export const API_URL = import.meta.env.VITE_API_PATH;