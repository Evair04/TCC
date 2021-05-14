<?php

namespace Base\Controller;

use Doctrine\ORM\EntityManager;
use Zend\Mvc\Controller\AbstractActionController;
use Zend\Session\Container;
use Zend\View\Model\ViewModel;
use Zend\Paginator\Paginator;
use Zend\Paginator\Adapter\ArrayAdapter;
use Zend\Authentication\AuthenticationService;

abstract class AbstractController extends AbstractActionController
{

    protected $em;

    public function __construct(){

    }


    public function validaSessao($fromIndex = false){
        $auth = new AuthenticationService();
        $session = $this->getService('Session');

        if (!$auth->hasIdentity() || $session->isExpiredAuthenticationTime()) {
            $session->clearAuthenticationExpirationTime();
            $auth->clearIdentity();
            if(!$fromIndex){
                $session->offsetSet('fimSessao', true);
            }
            return false;
        }

        $session->setAuthenticationExpirationTime();
        return true;
    }

    public function validaPermissao($identificador, $acao = null){
        //Ações: visualizacao | edicao | inclusao | exclusao
        $session = $this->getService('Session');
        $user = $session->offsetGet('user');

        if($user->getLogin() == 'SUPORTE') {
            return true;
        }

        $permissaoService = $this->getService('Application\Service\PerfilOperacaoPermitidaService');
        return $permissaoService->permiteOperacao($identificador, $acao);
    }

    /**
     * @return EntityManager
     */
    public function getEm() {
        $session = $this->getService('Session');
        if($session->offsetGet('user') != null){
            return $this->getService('role_entitymanager');
        }
        return $this->getService('doctrine.entitymanager.orm_default');

    }

    public function getEmHotStandBy()
    {
        return $this->getService('hot_standby_entitymanager');
    }

    public function getEmPesquisa()
    {
        return $this->getService('pesquisa_entitymanager');
    }

    public function getEmGateway()
    {
        return $this->getService('gateway_entitymanager');
    }

    public function getEmDw() {
        return $this->getService('dw_entitymanager');
    }

    public function getService($service){

        return $this->getServiceLocator()->get($service);

    }

    public function createInputFilterFactory($specificationInputFilter){
        return $this->getService('InputFilterManager')->get('InputFilter')->getFactory()
            ->createInputFilter($specificationInputFilter);
    }

    public function setMessagesWebService(Container $messages, $responseMesssage){ // Sera util para o checklist
        foreach ($responseMesssage as $msg){
            if($msg['tipo'] == 'erro'){
                $messages->erro = "<ul><li>".$msg['texto']."</ul></li><br>";
            }
            elseif($msg['tipo'] == 'info'){
                $messages->info = "<ul><li>".$msg['texto']."</ul></li><br>";
            }
            elseif($msg['tipo'] == 'warn'){
                $messages->warn = "<ul><li>".$msg['texto']."<br></ul></li><br>";
            }
        }
    }
}