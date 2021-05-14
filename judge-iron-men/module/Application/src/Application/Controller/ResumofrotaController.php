<?php

namespace Application\Controller;

use Application\Model\Veiculo;
use Application\Service\ResumoFrotaService;
use Base\Controller\AbstractController;
use Zend\View\Model\JsonModel;
use Zend\View\Model\ViewModel;
use Zend\Session\Container;

class ResumofrotaController extends AbstractController
{
    public function indexAction(){
        $modal = $this->params()->fromQuery('modal');
        $viewModel = new ViewModel(array(
            'modal' => $modal,
        ));

        if ($modal){
            $viewModel->setTerminal(true);
        }

        return $viewModel;

    }

    public function getjsondataresumoAction(){

        /** @var ResumoFrotaService $resumoService */
        $resumoService = $this->getService('Application\Service\ResumoFrotaService');

        $cond = $this->params()->fromPost();

        $result = $resumoService->getCompeticao($cond);

        $total = $resumoService->getTotal();

        $totalFiltrado = $resumoService->getTotalFiltrado($cond);

        $view = new JsonModel(array(
            'recordsTotal' => $total,
            'recordsFiltered' => $totalFiltrado,
            'data' => $result
        ));
        return $view->setTerminal(true);

    }
    public function getjsondatavoltasAction(){

        /** @var ResumoFrotaService $resumoService */
        $resumoService = $this->getService('Application\Service\ResumoFrotaService');

        $cond = $this->params()->fromPost();

        $result = $resumoService->getTodosRegistros($cond);

        $view = new JsonModel($result);
        return $view->setTerminal(true);

    }



}

