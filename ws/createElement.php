<?php

use Ws\Models\Element;

require_once 'interfaces/IToJson.php';
require_once 'models/Element.php';

$nombre = $_POST['nombre'];
$email = $_POST['email'];
$mensaje = $_POST['mensaje'];

$element = new Element($nombre, $email, $mensaje);

file_put_contents('elements.txt', $element->toJson(), FILE_APPEND);

echo $element->toJson();
