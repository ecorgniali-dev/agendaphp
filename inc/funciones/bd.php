<?php
require_once __DIR__ . '/../../vendor/autoload.php';
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../../');
$dotenv->load();

// credenciales de la base de datos
$DB_USUARIO  = $_ENV['DB_USUARIO'];
$DB_PASSWORD = $_ENV['DB_PASSWORD'];
$DB_HOST     = $_ENV['DB_HOST'];
$DB_NAME     = $_ENV['DB_NAME'];

$conn = new mysqli($DB_HOST, $DB_USUARIO, $DB_PASSWORD, $DB_NAME);

