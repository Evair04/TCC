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

use Doctrine\ORM\EntityManager;
use Zend\EventManager\AbstractListenerAggregate;
use Zend\Http\Request as HttpRequest;
use Zend\EventManager\EventManagerInterface;
use Zend\Mvc\MvcEvent;

class AuthenticationListener extends AbstractListenerAggregate
{
    private $usuarioRepository;
    private $entityManager;

    public function __construct(EntityManager $entityManager)
    {
        $this->entityManager = $entityManager;
        $this->usuarioRepository = $entityManager->getRepository('Api\Model\Usuario');
    }

    public function attach(EventManagerInterface $eventManager, $priority = 1)
    {
        $this->listeners[] = $eventManager->attach(
            MvcEvent::EVENT_ROUTE,
            [$this, 'onAuthenticate'],
            -500
        );
    }

    private function getRequest(MvcEvent $event)
    {
        $request = $event->getRequest();
        if (!$request instanceof HttpRequest
            || $request->isOptions()) {
            return null;
        }

        return $request;
    }

    public function onAuthenticate(MvcEvent $event)
    {
        $request = $this->getRequest($event);
        if (! $request) {
            return;
        }

        $usuario = $this->autenticar($request);
        if ($usuario) {
            $event->setParam('Prestor\Identity', $usuario);
        }
    }

    private function autenticar(HttpRequest $request)
    {
        $decodificado = base64_decode($this->getAuthentication($request));
        if ($decodificado === false) {
            return false;
        }

        $credenciais = explode(':', $decodificado);
        if (!is_array($credenciais) || count($credenciais) < 2) {
            return false;
        }

        list($login, $senha) = $credenciais;

        $login = mb_strtoupper($login);
        $senha = mb_strtoupper($senha);


        $usuario = $this->usuarioRepository
            ->createQueryBuilder('u')
            ->select(['u'])
            ->where('u.login = :login')
            ->setParameter('login', $login)
            ->getQuery()
            ->getOneOrNullResult();

        if (hash_equals($usuario->getSenha(), $senha)) {
            return $usuario;
        }

        return false;
    }

    /**
     * Verifica se a requisição possui o cabeçalho de autenticação.
     * Retorna o seu valor caso exista.
     *
     * @param HttpRequest $request
     * @return null|string Null se não encontrar o cabeçalho ou o valor do cabeçalho
     */
    private function getAuthentication(HttpRequest $request)
    {
        foreach ($request->getHeaders()->toArray() as $header => $value) {
            $lowerName = strtolower($header);
            if ($lowerName === 'authorization' || $lowerName  == 'credenciais') {
                if (preg_match('/basic ([^ ]+)/i', $value, $matches)) {
                    if (is_array($matches) && count($matches) > 1) {
                        return $matches[1];
                    }
                }
            }
        }
        return null;
    }
}
