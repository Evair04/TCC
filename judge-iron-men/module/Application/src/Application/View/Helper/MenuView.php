<?php

namespace Application\View\Helper;

use Zend\Http\Request;
use Zend\View\Helper\AbstractHelper;
use Zend\Session\Container;

class MenuView extends AbstractHelper
{
    public function __invoke()
    {
        $session = new Container('Session');

        return $this->escreveMenu($session->offsetGet('menu'));
    }

    public function escreveMenu($menu){

        $content = "<ul class='heightMenu'>";

        foreach($menu as $item){
            switch($item['tipo']){
                case 'MN':
                case 'SN':

                    $content .= "<li><a href='#'>{$item['label']}</a>";
                    $content .= $this->escreveMenu($item['filhos']);
                    $content .= "</li>";

                    break;

                case 'IN':
                    if($item['acao']){

                        $url = explode('/', $item['acao']);

                        if(count($url) > 1){
                            //Verifica se existe ação no item
                            try {
                                $acao = $this->view->url($url[0], array('action'=> $url[1]));
                            } catch(\Exception $e) {
                                $acao = '';
                            }

                            $content .= "<li><a id='{$item['idMenu']}' href='{$acao}'>{$item['label']}</a></li>";

                        }else{
                            //Verifica se existe ação no item
                            try {
                                $acao = $this->view->url($item['acao']);
                            } catch(\Exception $e) {
                                $acao = '';
                            }

                            $content .= "<li><a id='{$item['idMenu']}' href='{$acao}'>{$item['label']}</a></li>";
                        }


                    }else{
                        $content .= "<li class='disable' ><a>{$item['label']}</a></li>";

                    }

                    break;
            }
        }


        return $content."</ul>";
    }
}