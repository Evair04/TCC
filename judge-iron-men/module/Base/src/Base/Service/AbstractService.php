<?php

namespace Base\Service;

use Doctrine\ORM\EntityManager;
use Zend\ServiceManager\ServiceManager;
use Zend\ServiceManager\ServiceManagerAwareInterface;
use Zend\Authentication\AuthenticationService;

abstract class AbstractService implements ServiceManagerAwareInterface {

    /**
     * @var ServiceManager
     */
    protected $serviceManager;

    /**
     * @param ServiceManager $serviceManager
     */
    public function setServiceManager(ServiceManager $serviceManager) {
        $this->serviceManager = $serviceManager;
    }

    /**
     * Retrieve serviceManager instance
     *
     */
    public function getServiceManager() {
        return $this->serviceManager;
    }


    public function validaPermissao($identificador, $acao = null){

        //Ações: visualizacao | edicao | inclusao | exclusao
        $permissaoService = $this->getService('Application\Service\PerfilOperacaoPermitidaService');
        return $permissaoService->permiteOperacao($identificador, $acao);
    }

    /**
     * Retrieve EntityManager
     * @return EntityManager
     */
    public function getEm() {
        $session = $this->getService('Session');
        if($session->offsetGet('user') != null){
            return $this->getService('role_entitymanager');

        }
        return $this->getService('doctrine.entitymanager.orm_default');

    }

    /**
     * Retrieve Hot StandBy
     *
     */
    public function getEmHotStandBy() {
        return $this->getService('hot_standby_entitymanager');
    }

    /**
     * Retrieve EntityManager Pesquisa
     *
     */
    public function getEmPesquisa() {
        return $this->getService('pesquisa_entitymanager');
    }

    /**
     * Retrieve EntityManager dw
     *
     */
    public function getEmDw() {
        return $this->getService('dw_entitymanager');
    }

    /**
     * Retrieve EntityManager Gateway
     *
     */
    public function getEmGateway() {
        return $this->getService('gateway_entitymanager');
    }

    /**
     * Retrieve Service
     *
     * @return Service
     */
    protected function getService($service) {
        return $this->getServiceManager()->get($service);
    }

    /**
     *
     * @param type $data
     * @param type $indexValue
     * @param type $indexDescription
     * @return array Array contendo $indexDescription
     */
    public function comboFormat($data, $indexValue, $indexDescription){
        $combo = array();
        foreach ($data as $d) {
            $combo[$d[$indexValue]] = $d[$indexDescription];
        }
        return $combo;
    }

    /**
     *
     * @return string
     */
    protected function getRole(){
        $role = $this->getService('Session')->offsetGet('role');
        return $role;
    }


    /**
     * @param $segundos
     * @return string
     */
    protected function getStringHoursBySeg($segundos){
        $hr = (int) ($segundos / 3600);
        $min = (int) (($segundos % 3600) / 60);
        $seg = (int) (($segundos % 3600) % 60);

        $stringHr = $hr > 9 ? $hr : "0$hr";
        $stringMin = $min > 9 ? $min : "0$min";
        $stringSeg = $seg > 9 ? $seg : "0$seg";

        return "$stringHr:$stringMin:$stringSeg";
    }
}
