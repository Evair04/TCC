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

use Prestor\Http\Response;
use Zend\EventManager\AbstractListenerAggregate;
use Zend\EventManager\EventManagerInterface;

use Zend\Mvc\MvcEvent;
use Zend\Mvc\Router\Http\RouteMatch;

use Zend\View\Model\JsonModel;

use Zend\Http\Request as HttpRequest;

class AuthorizationListener extends AbstractListenerAggregate
{
    private $config;

    public function __construct($config)
    {
        $this->config = $config;
    }

    public function attach(EventManagerInterface $eventManager)
    {
        $this->listeners[] = $eventManager->attach(
            MvcEvent::EVENT_ROUTE,
            [$this, 'onAuthorization'],
            -800
        );
    }

    public function onAuthorization(MvcEvent $event)
    {
        $needsAuthorization = $this->requiresAuthorization($event);
        if (!$needsAuthorization) {
            return;
        }

        if ($event->getParam('Prestor\Identity')) {
            return;
        }

        return Response::erroComMensagem("Usuário ou senha incorretos", 401);
    }

    private function requiresAuthorization(MvcEvent $event)
    {
        $request = $event->getRequest();
        if (!$request instanceof HttpRequest
            || $request->isOptions()) {
            return null;
        }

        $routeMatches = $event->getRouteMatch();
        if (!($routeMatches instanceof RouteMatch)) {
            return null;
        }

        $controllerName = $routeMatches
            ->getParam('controller', false);
        if (!$controllerName) {
            return null;
        }

        if (!array_key_exists($controllerName, $this->config)) {
            return false;
        }

        $method = $request->getMethod();
        if (!array_key_exists($method, $this->config[$controllerName])) {
            return false;
        }

        return $this->config[$controllerName][$method];
    }
}
