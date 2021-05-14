<?php
namespace Application\Controller;

use Zend\View\Model\ViewModel;
use Zend\Authentication\AuthenticationService;
use Base\Controller\AbstractController;

class IndexController extends AbstractController
{
    public function indexAction(){

        $quadrosPerfil =
            array(
                array(
                    'nome' =>   'Resumo da Frota',
                    'id' =>     'quadro_resumofrota',
                    'acao' =>   'resumofrota',
                    'tipo' =>   'QGRID',
                    'width' => 12,
                    'height' => 9,
                    'x' => 0,
                    'y' => 7
                )
            );

        return new ViewModel(array(
            'acessoExterno' => 0,
            'quadrosPerfil' => json_encode($quadrosPerfil)
        ));
    }
}
