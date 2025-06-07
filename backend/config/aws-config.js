require("dotenv").config();
const AWS = require("aws-sdk");

const s3 = new AWS.S3({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const s3_BUCKET = process.env.S3_BUCKET;

module.exports = { s3, s3_BUCKET };
