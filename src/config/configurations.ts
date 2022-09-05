export default () => ({
  port: parseInt(process.env.PORT, 10) || 8080,
  host: "0.0.0.0",
  database: {
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
  },
});
