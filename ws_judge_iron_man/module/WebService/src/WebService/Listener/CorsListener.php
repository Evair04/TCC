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

namespace WebService\Listener;

use Zend\EventManager\AbstractListenerAggregate;
use Zend\Http\Request as HttpRequest;
use Zend\EventManager\EventManagerInterface;
use Zend\Mvc\MvcEvent;
use Zend\Mvc\Router\Http\RouteMatch;

class CorsListener extends AbstractListenerAggregate
{
    private $config;

    public function __construct($config)
    {
        $this->config = $config;
    }

    private function isCorsRequest(MvcEvent $event)
    {
        $request = $event->getRequest();
        if (!$request instanceof HttpRequest) {
            return false;
        }
/*
        if (!$request->getHeader('Origin')) {
            return false;
        }
*/
        if ($request->isOptions()) {
            return true;
        }

        $routeMatches = $event->getRouteMatch();
        if (!($routeMatches instanceof RouteMatch)) {
            return false;
        }

        $controllerName = $routeMatches
            ->getParam('controller', false);
        if (!$controllerName) {
            return false;
        }

        // Ativar cors para todos os métodos

//        if (!array_key_exists($controllerName, $this->config)) {
//            return false;
//        }
//
//        $method = $request->getMethod();
//        if (!array_key_exists($method, $this->config[$controllerName])) {
//            return false;
//        }
//
//        return $this->config[$controllerName][$method];

        return true;
    }

    public function attach(EventManagerInterface $eventManager, $priority = 1)
    {
        $this->listeners[] = $eventManager->attach(
            MvcEvent::EVENT_ROUTE,
            [$this, 'onRoute'],
            -1
        );

        $this->listeners[] = $eventManager->attach(
            MvcEvent::EVENT_FINISH,
            [$this, 'onRender'],
            100
        );
    }

    private function getCorsRequest(MvcEvent $event)
    {
        $request = $event->getRequest();
        if (!$request instanceof HttpRequest) {
            return null;
        }


        return $request;
    }

    public function onRender(MvcEvent $event)
    {

        if (!$this->isCorsRequest($event)) {
            return;
        }

        $response = $event->getResponse();

        $headers = $response->getHeaders();

        $headers->addHeaderLine('Access-Control-Allow-Origin', '*');
        $headers->addHeaderLine('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
        $headers->addHeaderLine('Access-Control-Allow-Headers', 'Content-Type, Authorization, Origin, Pragma, Cache-Control, Expires');


        $headers->addHeaderLine('Cache-Control', 'no-cache, no-store, must-revalidate');
        $headers->addHeaderLine('Pragma', 'no-cache');
        $headers->addHeaderLine('Expires', gmdate('D, d M Y H:i:s \G\M\T', time()));
//        var_dump($response);;exit;
        $event->setResponse($response);
    }

    public function onRoute(MvcEvent $event)
    {
        $request = $event->getRequest();

        if (!$request instanceof HttpRequest) {
            return;
        }

        if (!$this->isCorsRequest($event)) {
            return;
        }

        if (!$request->isOptions()) {
            return;
        }

        $response = $event->getResponse();
        $response->setStatusCode(200);

        $headers = $response->getHeaders();

        $headers->addHeaderLine('Access-Control-Allow-Origin', 'ionic://localhost');
        $headers->addHeaderLine('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
        $headers->addHeaderLine('Access-Control-Allow-Headers', 'Content-Type, Authorization, Origin, Pragma, Cache-Control, Expires');
        $headers->addHeaderLine('Content-Length', 0);

        return $response;
    }
}
