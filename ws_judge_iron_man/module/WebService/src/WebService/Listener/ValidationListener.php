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

use WebService\Http\Response;

class ValidationListener extends AbstractListenerAggregate
{
    private $config;
    private $inputFilterManager;

    public function __construct($config, $inputFilterManager)
    {
        $this->config = $config;
        $this->inputFilterManager = $inputFilterManager;
    }

    public function attach(EventManagerInterface $eventManager, $priority = 1)
    {
        $this->listeners[] = $eventManager->attach(MvcEvent::EVENT_ROUTE, [$this, 'onValidate'], -700);
    }

    private function getInputFilter(MvcEvent $event)
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

        $controllerName = $routeMatches->getParam('controller', false);
        if (!$controllerName) {
            return null;
        }

        if (!array_key_exists($controllerName, $this->config)) {
            return null;
        }

        $method = $request->getMethod();
        if (!array_key_exists($method, $this->config[$controllerName])) {
            return null;
        }

        return $this->inputFilterManager->get($this->config[$controllerName][$method]);
    }

    private function getRequestData(MvcEvent $event)
    {
        $request = $event->getRequest();

        if ($request->isGet()) {
            return $request->getQuery();
        }

        $contentType = $request->getHeader('Content-Type');
        if ($contentType && $contentType->getMediaType() === 'application/json') {
            return json_decode($request->getContent(), true);
        }

        return $request->getPost();
    }

    public function onValidate(MvcEvent $event)
    {
        $inputFilter = $this->getInputFilter($event);
        if (! $inputFilter) {
            return;
        }

        $data = $this->getRequestData($event);

        if ($data === null) {
            return Response::erroComMensagem("JSON inválido");
        }

//        $event->setParam('Prestor\Plugin\InputFilter', $inputFilter);
//        $event->setParam('Prestor\Plugin\InputData', $data);

        $inputFilter->setData($data);
        if ($inputFilter->isValid()) {
            return;
        }

        return Response::erroValidacao($inputFilter->getMessages());
    }
}
