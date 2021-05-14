<?php

namespace Api\Authentication\Adapter;

use Api\Model\PessoaFisica;
use Prestor\Filter\FormatarDocumento;
use Zend\Authentication\Adapter\AdapterInterface;
use Zend\Authentication\Result;
use Zend\EventManager\EventManagerInterface;
use Zend\Http\Request;
use Doctrine\ORM\EntityManager;

class HeaderAuthentication implements AdapterInterface
{
    /**
     * @var EntityManager
     */
    protected $em;

    /**
     * @var Request
     */
    protected $request;

    public function __construct(EntityManager $em, Request $request, EventManagerInterface $eventManager)
    {
        $this->em = $em;
        $this->request = $request;

        $eventManager->attach('dispatch', array($this, 'authenticate'), 10);
    }

    public function authenticate()
    {
        $request = $this->request;
        $headers = $request->getHeaders();

        // Check Authorization header presence
        if (!$headers->has('Authorization')) {
            if (!$headers->has('authorization')) {
                if (!$headers->has('AUTHOTIZATION')) {
                    if (!$headers->has('Credenciais')) {
                        return new Result(Result::FAILURE, null, array(
                            'Cabecalho de autorizacaoo nao informado'
                        ));
                    }
                }
            }
        }

        $authorization = "";

        if($headers->has('Authorization')) {
            $authorization = $headers->get('Authorization')
                ->getFieldValue();
        }

        if ($headers->has('Credenciais') && !$authorization) {
            $authorization = $headers->get('Credenciais')
                ->getFieldValue();
        }

        if ($headers->has('AUTHOTIZATION') && !$authorization) {
            $authorization = $headers->get('AUTHOTIZATION')
                ->getFieldValue();
        }

        if ($headers->has('authorization') && !$authorization) {
            $authorization = $headers->get('authorization')
                ->getFieldValue();
        }

        if (strpos($authorization, 'Basic') !== 0) {
            if (strpos($authorization, 'BASIC') !== 0) {
                return new Result(Result::FAILURE, null, array(
                    'Cabeçalho de autorização inválido, falta prefixo Basic'
                ));
            }
        }

        $auth_array = explode(' ', $authorization);
        if (count($auth_array) != 2) {
            return new Result(Result::FAILURE, null, array(
                'Valor do hash de autorização inválido, hash Basic 64 padrão: "usuario:senha"'
            ));
        }
        $base64_decoded = base64_decode($auth_array[1]);

        $array_auth_decoded = explode(':', $base64_decoded);
        if (count($array_auth_decoded) != 2) {
            return new Result(Result::FAILURE, null, array(
                'Valor do hash de autorização inválido, hash Basic 64 padrão: "usuario:senha"'
            ));
        }

        $login = $array_auth_decoded[0];
        $senha = $array_auth_decoded[1];

        $user = $this->em->getRepository('Api\Model\Usuario')
                ->findOneBy(array(
            'login' => mb_strtoupper($login),
            'senha' => mb_strtoupper($senha),
        ));



        if ($user === null) {
            $code = Result::FAILURE_IDENTITY_NOT_FOUND;
            return new Result($code, null, array(
                'Usuario não encontrado na base de dados'
            ));
        }

        return new Result(Result::SUCCESS, $user);
    }
}
