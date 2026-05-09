<?php
// Configuration for Database Connection
define('DB_HOST', 'localhost');
define('DB_NAME', 'u260890310_cbidb');
define('DB_USER', 'u260890310_admin');
define('DB_PASS', '4L13nw4r3!@#$%'); // CHANGE THIS TO YOUR ACTUAL PASSWORD

// Error Reporting (Turn off for production, On for debugging)
error_reporting(E_ALL);
ini_set('display_errors', 0); // Keep 0 for API to avoid breaking JSON response

// CORS Headers (Allow access from any origin - adjust for production)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Handle Preflight Options Request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}
?>