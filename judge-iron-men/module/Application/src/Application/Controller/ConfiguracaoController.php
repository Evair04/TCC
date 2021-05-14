<?php

namespace Application\Controller;


use Base\Controller\AbstractController;
use Zend\View\Model\JsonModel;
use Zend\View\Model\ViewModel;

class ConfiguracaoController extends AbstractController
{
    public function setconfgridAction()
    {

        if(!$this->validaSessao()){
            $this->getResponse()->setStatusCode(401);
            return false;
        }

        $data = $this->params()->fromPost();

        $this->getEm()->beginTransaction();
        try {

            $this->getService('Application\Service\ConfiguracaoService')
                ->setConfigGrid($data['data']);

            $this->getEm()->commit();

        } catch (\Exception $e) {
            $this->getEm()->rollback();
            $this->getResponse()->setStatusCode(400);

        }

        return $this->response;


    }
    public function getagrupamentomapaAction()
    {

        if (!$this->validaSessao()) {
            $this->getResponse()->setStatusCode(401);
            return false;
        }
        $sessao = $this->getService('Session');
        $usuario = $sessao->offsetGet('user');
        $configGrid = $this->getService('Application\Service\SistemaRegistroService')
            ->getValorByChave('TRAFEGUS_WEB_AGR_'.$usuario->getId());

        return new JsonModel(array('config' => $configGrid));

    }
    public function buscatipoconfigicscafAction()
    {
        $data = $this->params()->fromQuery();

        $tipoTransporte = $this->getEm()->find('Application\Model\TipoTransporte', (int) $data['tipoTransporte']);
        $tipoTransporteCchp = $this->getEm()->getRepository('Application\Model\ConfiguracaoChp')->findAll()[0];

        if(!$this->validaSessao()){
            $this->getResponse()->setStatusCode(401);
            return false;
        }

        if ($tipoTransporte == $tipoTransporteCchp->getTipoTransporteCaf()){
            return new JsonModel(array('response' => true));
        }else
            return new JsonModel(array('response' => false));

//        return new JsonModel(array('tipoTransporte' => $tipoTransporte->getTipoTransporteCaf()));
    }

    public function setagrupamentomapaAction()
    {
        $session = $this->getService('Session');
        if(!$this->validaSessao()){
            $this->getResponse()->setStatusCode(401);
            return false;
        }

        $data = $this->params()->fromPost();

        $this->getEm()->beginTransaction();
        try {
            $sessao = $this->getService('Session');
            $usuario = $sessao->offsetGet('user');
            $sistemaRegistroService = $this->getService('Application\Service\SistemaRegistroService');
            $sistemaRegistroService->deleteRegistro('TRAFEGUS_WEB_AGR_'.$usuario->getId());
            $sistemaRegistroService->salvaRegistro('TRAFEGUS_WEB_AGR_'.$usuario->getId(),$data['configuracao_grupo'] );
            $this->getEm()->commit();
            $session->offsetSet('agruparVeiculos',
                $sistemaRegistroService->getValorByChave('TRAFEGUS_WEB_AGR_'.$usuario->getId())
            );
            return new JsonModel(array('response' => true));

        } catch (\Exception $e) {
            $this->getEm()->rollback();
            $this->getResponse()->setStatusCode(400);
            return new JsonModel(array('response' => false));
        }

    }


    public function getconfgridAction(){
        $tabela = $this->params()->fromQuery('id');

        $configGrid = $this->getService('Application\Service\ConfiguracaoService')
            ->getConfigGrid($tabela);

        return new JsonModel($configGrid);
    }
}