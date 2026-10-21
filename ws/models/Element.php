<?php

declare(strict_types=1);

namespace Ws\Models;

use Ws\Interfaces\IToJson;

class Element implements IToJson
{
    private string $nombre;
    private string $email;
    private string $mensaje;

    public function __construct(string $nombre, string $email, string $mensaje)
    {
        $this->nombre = $nombre;
        $this->email = $email;
        $this->mensaje = $mensaje;
    }

    public function getNombre(): string
    {
        return $this->nombre;
    }

    public function setNombre(string $nombre): void
    {
        $this->nombre = $nombre;
    }

    public function getEmail(): string
    {
        return $this->email;
    }

    public function setEmail(string $email): void
    {
        $this->email = $email;
    }

    public function getMensaje(): string
    {
        return $this->mensaje;
    }

    public function setMensaje(string $mensaje): void
    {
        $this->mensaje = $mensaje;
    }

    public function toJson(): string
    {
        // get_object_vars() incluye todas las propiedades, también las privadas
        return json_encode(
            get_object_vars($this),
            JSON_UNESCAPED_UNICODE | JSON_INVALID_UTF8_SUBSTITUTE | JSON_THROW_ON_ERROR
        );
    }
}
