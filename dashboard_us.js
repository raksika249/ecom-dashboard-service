const AWS = require("aws-sdk");

const dynamodb = new AWS.DynamoDB.DocumentClient();

const PRODUCTS_TABLE = process.env.PRODUCTS_TABLE;

/* ---------- RESPONSE ---------- */
const response = (statusCode, body) => ({
  statusCode,
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type,Authorization",
    "Access-Control-Allow-Methods": "GET,OPTIONS"
  },
  body: JSON.stringify(body)
});

/* ---------- HANDLER ---------- */
exports.handler = async (event) => {

  const method =
    event.httpMethod ||
    event.requestContext?.http?.method;

  /* CORS */
  if (method === "OPTIONS") {
    return response(200, {});
  }

  try {
    if (method !== "GET") {
      return response(405, { message: "Method not allowed" });
    }

    const result = await dynamodb.scan({
      TableName: PRODUCTS_TABLE
    }).promise();

    return response(200, {
      products: result.Items || []
    });

  } catch (err) {
    console.error("PRODUCT FETCH ERROR:", err);
    return response(500, { message: "Failed to load products" });
  }
};
