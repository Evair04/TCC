<?php
/*
{************************************************************************}
{ }
{ CHP Soluções em Tecnologia }
{ Produto da Familia Trafegus }
{ }
{ Copyright (c) 2011-2018 }
{ TODOS OS DIREITOS RESERVADOS }
{ }
{ Todos os conteúdos deste arquivo é protegido }
{ por leis internacionasis de registro e patente. }
{ A reprodução não autorizada, engenharia reversa ou distribuição }
{ de todos ou parte do codigo contidos neste arquivo são }
{ estritamente proibidas e podem resultar em severas penalidades }
{ civis e criminais, processados na máxima extensão possível ao }
{ abrigo da lei. }
{ }
{ RESTRIÇÕES }
{ }
{ ESTE CÓDIGO FONTE E TODOS OS ARQUIVOS RESULTANTES (PHP, CSS, JS, ETC)}
{ SÃO CONFIDENCIAIS E PROPRIETÁRIAS, COM DIREITOS COMERCIAIS }
{ EXCLUSIVO DA CHP SOLUÇÕES LTDA EPP. }
{ O CÓDIGO-FONTE CONTIDO DENTRO DESTE ARQUIVO OU QUALQUER PARTE DO }
{ SEU CONTEÚDO, NÃO PODE SER COPIADO, TRASFERIDO, VENDIDO OU }
{ DISTRIBUÍDO DE OUTRA FORMA PARA OUTRAS PESSOAS SEM CONSENTIMENTO }
{ EXPRESSO POR ESCRITO SEDIDO PELA CHP SOLUÇÕES LTDA EPP. }
{ PARA MAIS INFORMAÇÕES CONSULTAR O CONTRATO DE LICENÇA DE USO E }
{ SUAS RESTRIÇOES ADICIONAIS. }
*/

namespace Application\Service;

use Zend\Http\Client;
use Zend\Http\Request;
use Zend\Stdlib\Parameters;
use Base\Service\AbstractService;

class WsConnectService extends AbstractService
{
    public function getRequest(){
        $sessao = $this->getService('Session');
        $usuario = $sessao->offsetGet('user');

        $encodeLogin = base64_encode("{$usuario->getLogin()}:{$usuario->getSenha()}");
        $request = new Request();
        $request->getHeaders()->addHeaders(array(
            'Content-type' => 'application/json',
            'Authorization' => "Basic $encodeLogin"
        ));

        return $request;
    }

    public function getRequestGet($action, $params){
        $request = $this->getRequest();
        $request->setUri(URL_WEB_SERVICE.$action);
        $request->setMethod('GET');

        if($params){
            $request->setQuery(new Parameters($params));
        }

        $client = new Client();
        $client->setOptions(array('timeout' => 600));
        $client->setRequest($request);

        return $client;
    }

    public function getRequestPost($action, $data){
        $request = $this->getRequest();
        $request->setUri(URL_WEB_SERVICE.$action);
        $request->setMethod('POST');
        $request->setContent(json_encode($data));

        $client = new Client();
        $client->setOptions(array('timeout' => 600));
        $client->setRequest($request);

        return $client;
    }

    public function getRequestPut($action, $id, $data, $params = null){
        $request = $this->getRequest();
        $request->setUri(URL_WEB_SERVICE."$action/$id");
        $request->setMethod('PUT');
        $request->setContent(json_encode($data));
        if($params){
            $request->setPost(new Parameters($params));
        }

        $client = new Client();
        $client->setOptions(array('timeout' => 600));

        $client->setRequest($request);

        return $client;
    }

    public function getRequestDelete($action, $id, $params = null){
        $request = $this->getRequest();
        $request->setUri(URL_WEB_SERVICE."$action/$id");
        $request->setMethod('DELETE');
        if($params){
            $request->setPost(new Parameters($params));
        }

        $client = new Client();
        $client->setOptions(array('timeout' => 600));
        $client->setRequest($request);

        return $client;
    }

    public function getResponseError($response){
        $response = json_decode($response->getBody());

        $contentResponse['error'] = (array) $response->error->status;
        $contentResponse['message'] = (array) $response->error->mensagens;

        foreach ($contentResponse['error'] as $key => $erro){
            $contentResponse['error'][$key] = (array) $erro;
        }

        foreach ($contentResponse['message'] as $key => $msg){
            $contentResponse['message'][$key] = (array) $msg;
        }

        return $contentResponse;
    }

    public function getMessagesResponse($response){
        $contentResponse = (array) json_decode($response->getBody());

        foreach ($contentResponse['error'] as $key => $erro){
            $contentResponse['error'][$key] = (array) $erro;
        }

        foreach ($contentResponse['success'] as $key => $success){
            $contentResponse['sucess'][$key] = (array) $success;
        }

        foreach ($contentResponse['avisos'] as $key => $avisos){
            $contentResponse['avisos'][$key] = (array) $avisos;
        }

        return $contentResponse;
    }
}