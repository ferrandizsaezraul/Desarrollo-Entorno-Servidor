<?php

declare(strict_types=1);

use Ws\Models\Element;

require_once __DIR__ . '/interfaces/IToJson.php';
require_once __DIR__ . '/models/Element.php';

const ELEMENTS_FILE = __DIR__ . '/elements.txt';

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    header('Allow: POST');
    echo json_encode(['error' => 'Método no permitido, usa POST'], JSON_UNESCAPED_UNICODE);
    exit;
}

// 1. Recoger los datos del formulario
// filter_input() devuelve null si el campo no llega y false si no es un texto
$nombre = trim((string) filter_input(INPUT_POST, 'nombre'));
$email = trim((string) filter_input(INPUT_POST, 'email'));
$mensaje = trim((string) filter_input(INPUT_POST, 'mensaje'));

$errores = [];

if ($nombre === '') {
    $errores[] = 'El nombre es obligatorio';
}

if (filter_var($email, FILTER_VALIDATE_EMAIL) === false) {
    $errores[] = 'El correo electrónico no es válido';
}

if ($mensaje === '') {
    $errores[] = 'El mensaje es obligatorio';
}

if ($errores !== []) {
    http_response_code(400);
    echo json_encode(['errores' => $errores], JSON_UNESCAPED_UNICODE);
    exit;
}

// 2. Crear el elemento
$element = new Element($nombre, $email, $mensaje);
$json = $element->toJson();

// 3. Guardarlo al final del fichero (FILE_APPEND no sobrescribe, LOCK_EX evita escrituras simultáneas)
if (file_put_contents(ELEMENTS_FILE, $json . PHP_EOL, FILE_APPEND | LOCK_EX) === false) {
    http_response_code(500);
    echo json_encode(['error' => 'No se ha podido guardar el elemento'], JSON_UNESCAPED_UNICODE);
    exit;
}

// 4. Mostrar el elemento creado en formato JSON
http_response_code(201);
echo $json;
