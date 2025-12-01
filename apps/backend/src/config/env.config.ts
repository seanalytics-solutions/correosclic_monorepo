export const envConfig = {
  cloudflare_bucket_name: process.env.AWS_S3_BUCKET || '',
  cloudflare_r2_endpoint: process.env.AWS_S3_ENDPOINT || '',
  cloudflare_r2_access_key: process.env.AWS_ACCESS_KEY_ID || '',
  cloudflare_r2_secret_key: process.env.AWS_SECRET_ACCESS_KEY || '',
};
