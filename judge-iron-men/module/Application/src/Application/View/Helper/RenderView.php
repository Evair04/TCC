<?php

namespace Application\View\Helper;

use Zend\View\Helper\AbstractHelper;

class RenderView extends AbstractHelper
{

    /**
     * Renderiza o cabeçalho de uma view no site de acordo com o tipo de renderização passado.
     *
     * @param Int $tipo
     * @param String $id
     * @param String $icone
     * @param String $tituloLateral
     * @param String $tituloPrincipal
     * @param array $botoes Ex. array(array('id', 'url', 'label'))
     *
     * @return String
     */
    public function getHeader($tipo, $id, $icone, $tituloLateral, $tituloPrincipal, $botoes = [], $noSpace = false){
       // var_dump($noSpace);exit;
        if ($noSpace){
            return $this->getNormalHeaderNoSpace($id, $tituloPrincipal);
        }
        switch($tipo){
            case 1:
                return $this->getModalHeader($id, $tituloPrincipal);
                break;
            case 2:
                return $this->getFrameHeader($id, $tituloPrincipal);
                break;
            default:
                return $this->getNormalHeader($id, $icone, $tituloLateral, $tituloPrincipal, $botoes);
        }

    }




    /**
     * Renderiza o rodapé de uma view no site de acordo com o tipo de renderização passado.
     *
     * @param Int $tipo
     * @param array $botoes
     *
     * @return String
     */
    public function getFooter($tipo, $botoes = [], $noSpace = null){
        if ($noSpace){
            return $this->getNormalFooterNoSpace();
        }

        switch($tipo){
            case 1:
                return $this->getModalFooter($botoes);
                break;
            case 2:
                return $this->getFrameFooter($botoes);
                break;
            default:
                return $this->getNormalFooter();
        }

    }




    /********************************************* NORMAL FUNCTIONS ***************************************************/

    public function getNormalHeader($id, $icone, $tituloLateral, $tituloPrincipal, $botoes = []){

        $html = "<div class='clearfix'>	</div>
                    <div class='row m-t-20'>
                        <div class='col-md-2 screen-lateral'>
                            <div class='center-block text-center'>
                                <span class='fa-stack fa-lg fa-3x cor-1'>
                                    <i class='far fa-circle fa-stack-2x'></i>
                                    <i class='{$icone} fa-stack-1x'></i>
                                </span>
                            </div>
                            <h2 class='tiulo-lateral fonte-roboto-bold text-center m-t-10'>{$tituloLateral}</h2>";

        foreach ($botoes as $b){
            if ($b['url'])
                $html .= "<a href='".PUBLIC_URL."{$b['url']}' class='btn btn-raised btn-default btn-block btn-lg center-block text-center {$b['classe']}'>{$b['label']}</a>";
            else
                $html .= "<a class='btn btn-raised btn-default btn-block btn-lg center-block text-center {$b['classe']}'>{$b['label']}</a>";

        }

        $html .= "      </div>
                        <div class='col-md-10 formulario-interno'>
                            <div class='sombra sombra-padding-2x p-t-20'>
                                <h2 class='cor-1 texto-2 m-b-15'>{$tituloPrincipal}</h2>
                                <div class='clearfix'>	</div>
                                <div id='content-{$id}'>";
        return $html;
    }
    public function getNormalHeaderNoSpace($id, $tituloPrincipal){

        $html = "<div class='clearfix'>	</div>
                        <div class='formulario-interno'>
                            <div class='sombra sombra-padding-2x p-t-20'>
                                <h2 class='cor-1 texto-2 m-b-15'>{$tituloPrincipal}</h2>
                                <div class='clearfix'>	</div>
                                <div id='content-{$id}'>";
        return $html;
    }

    public function getNormalFooterNoSpace(){
        return "                
                            </div>
                        </div>
                    </div>";
    }
    public function getNormalFooter(){
        return "                </div>
                            </div>
                        </div>
                    </div>";
    }






    /********************************************* MODAL FUNCTIONS ***************************************************/

    public function getModalHeader($id, $tituloPrincipal){

        return "<div id='modal-{$id}' class='modal fade' role='dialog' 
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

    public function getModalFooter($botoes = []){
        $html = '';
        foreach ($botoes as $b){
            $html .= "<a id='{$b['id']}' href='#' class='btn btn-raised btn-default {$b['classe']}'>{$b['label']}</a>";

        }

        $html .= "                      </div>
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

    public function getFrameHeader($id, $tituloPrincipal){

        return "<div id='frame-{$id}'>
                  <h2 class='cor-1 m-b-15'>{$tituloPrincipal}</h2>";
    }

    public function getFrameFooter($botoes = []){
        $html = '';
        foreach ($botoes as $b){
            $html .= "<a id='{$b['id']}' href='#' class='btn btn-sm btn-raised btn-default {$b['classe']}'>{$b['label']}</a>";

        }

        $html .= "
                </div>";
        return $html;
    }
}