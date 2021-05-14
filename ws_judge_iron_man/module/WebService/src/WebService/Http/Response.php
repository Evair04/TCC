<?php

namespace WebService\Http;

use Zend\Http\Response as HttpResponse;

class Response extends HttpResponse
{
    const TIPO_MENSAGEM_INFO = "info";
    const TIPO_MENSAGEM_WARNING = "warn";
    const TIPO_MENSAGEM_ERRO = "erro";

    public static function sucesso($corpo, $statusCode=200)
    {
        return new Response($statusCode, [
            'success' => $corpo,
            'error' => []
        ]);
    }

    public static function erro($corpo, $statusCode=400)
    {
        return new Response($statusCode, [
            'success' => [],
            'error' => $corpo
        ]);
    }

    public static function erroComMensagem($mensagem, $statusCode=400)
    {
        return self::erro([
            "codigo" => -1,
            'mensagens' => [
                [
                    'tipo' => self::TIPO_MENSAGEM_ERRO,
                    'status' => $statusCode,
                    'texto' => $mensagem
                ]
            ],
        ], $statusCode);
    }

    public static function erroComMultiplasMensagens($mensagens, $statusCode = 400)
    {
        $mensagensFormatadas = [];
        foreach ($mensagens as $mensagem) {
            $mensagensFormatadas[] = [
                [
                    'tipo' => self::TIPO_MENSAGEM_ERRO,
                    'status' => $statusCode,
                    'texto' => $mensagem
                ]
            ];
        }
        return self::erro(["codigo" => -1, 'mensagens' => $mensagensFormatadas], $statusCode);
    }

    public static function erroValidacao($errosValidacao)
    {
        return self::erro([
            'codigo' => -1,
            'status' => $errosValidacao
        ]);
    }

    public function __construct($statusCode, $body)
    {
        $this->setStatusCode($statusCode);
        $this->getHeaders()->addHeaderLine('Content-Type', 'application/json');
        $this->setContent(json_encode($body, JSON_UNESCAPED_SLASHES));
    }
}
