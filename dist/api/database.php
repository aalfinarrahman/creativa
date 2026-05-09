<?php
require_once 'config.php';

function getDbConnection() {
    try {
        // Use DB_HOST from config.php
        $dsn = "mysql:host=" . DB_HOST . ";port=3306;dbname=" . DB_NAME . ";charset=utf8mb4";
        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ];
        
        $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
        return $pdo;
    } catch (\PDOException $e) {
        // Return JSON error
        http_response_code(500);
        echo json_encode(['error' => 'Connection failed: ' . $e->getMessage()]);
        exit;
    }
}
?>