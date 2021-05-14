<?php

namespace Application\View\Helper;

use Zend\View\Helper\AbstractHelper;

class RenderStepView extends AbstractHelper
{

    /**
     * Renderiza o cabeçalho de uma view no site de acordo com o tipo de renderização.
     *
     * @param Int $tipo
     * @param String $formOpenTagHTML
     * @param String $idModal
     * @param String $icone
     * @param String $tituloLateral
     * @param String $tituloPrincipal
     * @param array $steps Ex. array(array('id', 'url', 'label'))
     * @param array $acoes Ex. array(array('classe', 'label'))
     *
     * @return String
     */
    public function getHeader($tipo, $formOpenTagHTML = '', $idModal, $idWizard, $icone, $tituloLateral, $tituloPrincipal, $steps = []){

        switch($tipo){
            case 1:
                return $this->getModalHeader($idModal, $idWizard, $formOpenTagHTML, $tituloPrincipal, $steps);
                break;
            case 2:
                return $this->getFrameHeader($idModal, $idWizard, $formOpenTagHTML, $tituloPrincipal, $steps);
                break;
            default:
                return $this->getNormalHeader($icone, $tituloLateral, $idWizard, $formOpenTagHTML, $tituloPrincipal, $steps);
        }

    }


    /**
     * Renderiza o rodapé de uma view no site de acordo com o tipo de renderização.
     *
     * @param Int $tipo
     * @param String $formCloseTagHTML
     * @param array $acoes Ex. array(array('classe', 'label'))
     *
     * @return String
     */
    public function getFooter($tipo, $formCloseTagHTML = '', $acoes = []){

        switch($tipo){
            case 1:
                return $this->getModalFooter($formCloseTagHTML, $acoes);
                break;
            case 2:
                return $this->getFrameFooter($formCloseTagHTML, $acoes);
                break;
            default:
                return $this->getNormalFooter($formCloseTagHTML, $acoes);
        }

    }




    /********************************************* NORMAL FUNCTIONS ***************************************************/

    public function getNormalHeader($icone, $tituloLateral, $idWizard, $formOpenTagHTML, $tituloPrincipal, $steps = []){

        $html = "<div class='clearfix'>	</div>
                    <div id='{$idWizard}' class='row m-t-20 wizard-container'>
                        <div class='col-md-2 steps'>
                            <div class='center-block text-center'>
                                <span class='fa-stack fa-lg fa-3x cor-1'>
                                    <i class='far fa-circle fa-stack-2x'></i>
                                    <i class='{$icone} fa-stack-1x'></i>
                                </span>
                            </div>
                            <h2 class='tiulo-lateral fonte-roboto-bold text-center m-t-10'>{$tituloLateral}</h2>
                            <ul class='m-t-20 steps-wizard'>";

        foreach ($steps as $b){
            $html .= "<li id='{$b['id']}' class='".(isset($b['classe']) ? $b['classe']: null)."'>
                        <a href='{$b['url']}' data-toggle='tab' >
                            {$b['label']}
                        </a>
                        </li>";
        }

        $html .= "      
                            </ul>
                        </div>
                        <div class='col-md-10 formulario-interno'>
                            <div class='sombra sombra-padding-2x p-t-20 p-b-20'>
                                <h2 class='cor-1 texto-2 '>{$tituloPrincipal}</h2>
                                <div class='clearfix'>	</div>
                                {$formOpenTagHTML}
                                    <div class='tab-content'>";
        return $html;
    }

    public function getNormalFooter($formCloseTagHTML, $acoes){

        $html = "";

        if(count($acoes) > 0){
            $html .= "<ul class='pager wizard'>";
            foreach ($acoes as $b){
                $html .= "<li id='{$b['id']}' class='{$b['classe']} btn btn-default btn-raised'>{$b['label']}</li>";
            }
            $html .= "</ul>";
        }

        $html .= " 
                                    </div>
                                {$formCloseTagHTML}
                            </div>
                        </div>
                    </div>";

        return $html;
    }






    /********************************************* MODAL FUNCTIONS ***************************************************/

    public function getModalHeader($idModal, $idWizard, $formOpenTagHTML, $tituloPrincipal, $steps){

        return "<div id='modal-{$idModal}' class='modal fade' tabindex='-1' role='dialog' 
                                aria-labelledby='custom-width-modalLabel' aria-hidden='true'>
                    <div class='modal-dialog w-p-80'>
                        <div class='modal-content'>
                            <div class='modal-body'>
                                <div class='modal-header'>
                                    <button type='button' class='close' data-dismiss='modal' aria-hidden='true'>&times;</button>
                                    <h2 class='modal-title text-center fonte-roboto-bold cor-1'>{$tituloPrincipal}</h2>
                                    <div class='modal-body formulario-interno' style='overflow: auto'>
                                        <div>";
    }

    public function getModalFooter($formCloseTagHTML){

        $html = "                       </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class='modal-footer'>
                        </div>
                    </div>
                </div>";
        return $html;
    }






    /********************************************* FRAME FUNCTIONS ***************************************************/

    public function getFrameHeader($idModal, $idWizard, $formOpenTagHTML, $tituloPrincipal, $steps){

        return "<div id='frame-{$idModal}'>
                  <h3 class='cor-1 m-b-15'>{$tituloPrincipal}</h3>";
    }

    public function getFrameFooter($formCloseTagHTML){
        $html = '';
        foreach ($formCloseTagHTML as $b){
            $html .= "<a id='{$b['id']}' href='#' class='btn btn-sm btn-raised btn-default {$b['classe']}'>{$b['label']}</a>";

        }

        $html .= "
                </div>";
        return $html;
    }
}