<?php
/*
{************************************************************************}
{                                                                        }
{       CHP Soluções em Tecnologia                                       }
{       Produto da Familia Trafegus                                      }
{                                                                        }
{       Copyright (c) 2011-2018                                          }
{       TODOS OS DIREITOS RESERVADOS                                     }
{                                                                        }
{   Todos os conteúdos deste arquivo é protegido                         }
{   por leis internacionasis de registro e patente.                      }
{   A reprodução não autorizada, engenharia reversa ou distribuição      }
{   de todos ou parte do codigo contidos neste arquivo são               }
{   estritamente proibidas e podem resultar em severas penalidades       }
{   civis e criminais, processados na máxima extensão possível ao        }
{   abrigo da lei.                                                       }
{                                                                        }
{   RESTRIÇÕES                                                           }
{                                                                        }
{   ESTE CÓDIGO FONTE E TODOS OS ARQUIVOS RESULTANTES (PHP, CSS, JS, ETC)}
{   SÃO CONFIDENCIAIS E PROPRIETÁRIAS, COM DIREITOS COMERCIAIS           }
{   EXCLUSIVO DA CHP SOLUÇÕES LTDA EPP.                                  }
{   O CÓDIGO-FONTE CONTIDO DENTRO DESTE ARQUIVO OU QUALQUER PARTE DO     }
{   SEU CONTEÚDO, NÃO PODE SER COPIADO, TRASFERIDO, VENDIDO OU           }
{   DISTRIBUÍDO DE OUTRA FORMA PARA OUTRAS PESSOAS SEM CONSENTIMENTO     }
{   EXPRESSO POR ESCRITO SEDIDO PELA CHP SOLUÇÕES LTDA EPP.              }
{   PARA MAIS INFORMAÇÕES CONSULTAR O CONTRATO DE LICENÇA DE USO E       }
{   SUAS RESTRIÇOES ADICIONAIS.                                          }
*/


namespace Application\View\Helper;
use Zend\Http\Request;
use Zend\View\Helper\AbstractHelper;
use Zend\Session\Container;

class MenuViewClassico extends AbstractHelper
{
    public function __invoke()
    {
        $session = new Container('Session');

        return $this->escreveMenuPai($session->offsetGet('menu'));
    }

    public function escreveMenuPai($menu){

        $content = "<ul class='nav navbar-nav cabecalho-menu' id='dropdownMenuLink' >";

//        var_dump($menu);exit;
        foreach($menu as $item){
            if ($item['tipo'] == 'MN'){
                $floating = '';
                $qtdMenu = 0;
                foreach ($item['filhos'] as $filho){
                    if ($filho['tipo'] == 'SN')
                        $qtdMenu++;
                }
                if ($qtdMenu <= 5)
                    $floating = 'floating';

                $content .= "<li  class='dropdown dropdown-large bar p-l-0 p-0'><a data-toggle='dropdown' class='dropdown-toggle dropdown-toggle-large text-center' style='background-color: #4CC2E0; color: white' href='#'>{$item['label']}</a>";
                    $content .= "<ul class='borda-azul dropdown-menu dropdown-menu-large row menu-pai $floating' aria-labelledby='dropdownMenuButton'>";
                        $content .= "<div class='row m-l-10' >";
                            $content .= $this->escreveMenuFilho($item['filhos'], $item['tipo']);
                        $content .= "</div>";
                    $content .= "</ul>";
                $content .= "</li>";

            }
        }

        return $content."</ul>";
    }

    public function escreveMenuFilho($menu, $tipoPai){
//        echo '<pre>'; print_r($menu);
        foreach ($menu as $item) {
            $classCor = '';
            $mtmenus100 = '';
            if ($item['label'] == 'Viagens')
                $mtmenus100 = 'm-t-menos-100';
            if (count($menu)>=8)
                $classFilho = "col-md-3 $mtmenus100";
            else if (count($menu)>=3)
                $classFilho = 'col-md-12';
            else
                $classFilho = 'col-md-12';

            if ($item['acao']) {
                $classFilho = '';
            } elseif ($tipoPai == 'SN' && $item['tipo'] == 'SN'){
                $classFilho = 'color-padrao-1 ';
                $classCor = 'color-padrao-1';
            }
            $content .= "<li class='p-0  $classFilho'>";
            $content .= "<ul class='p-l-20'>";
            if ($item['tipo'] == 'SN') {
                    $content .= "<div class=''>";
                        $content .= "<li class='p-0 dropdown-header '><span class='text-primary h4 $classCor' href='#'>{$item['label']}</span></li>";
                        $content .= $this->escreveMenuFilho($item['filhos'], $item['tipo']);
                    $content .= "</div><br>";
            } else if ($item['tipo'] == 'IN') {

                    if ($item['acao']) {

                        $url = explode('/', $item['acao']);

                        if (count($url) > 1) {
                            //Verifica se existe ação no item
                            try {
                                $acao = $this->view->url($url[0], array('action' => $url[1]));
                            } catch (\Exception $e) {
                                $acao = '';
                            }

                            $content .= "<li class='p-0'><a id='{$item['idMenu']}' href='{$acao}'>{$item['label']}</a></li>";

                        } else {
                            //Verifica se existe ação no item
                            try {
                                $acao = $this->view->url($item['acao']);
                            } catch (\Exception $e) {
                                $acao = '';
                            }

                            $content .= "<li class='p-0'><a id='{$item['idMenu']}' href='{$acao}'>{$item['label']}</a></li>";
                        }


                    } else {
                        $content = "<li class=' p-0 disable ' ><a>{$item['label']}</a></li>";

                    }

            }
            $content .= "</ul>";
            $content .= "</li>";

        }

        return $content;
    }
}