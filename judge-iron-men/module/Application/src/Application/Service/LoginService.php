<?php

namespace Application\Service;

use Application\Model\Usuario;
use Base\Service\AbstractService;
use Zend\Session\SessionManager;
use Zend\Session\Config\SessionConfig;
use Zend\Session\Container;

class LoginService extends AbstractService
{
    public function validaUsuario($login, $senha){
        $authService = $this->getService('Zend\Authentication\AuthenticationService');
        $adapter = $authService->getAdapter();
        $adapter->setIdentity($login);
        $adapter->setCredential($senha);

        $authResult = $authService->authenticate();


        if($authResult->isValid() && $authResult->getIdentity()->getGrupoVisualizacao() && $authResult->getIdentity()->getPerfil() && ($authResult->getIdentity()->getObjetoRastreado()->getStatus()->getId() == 1)){

            $usua = $authResult->getIdentity();

            $menuService = $this->getService('Application\Service\MenuService');
            $empresaService = $this->getService('Application\Service\EmpresaService');
            $vinculoEmpresaService = $this->getService('Application\Service\VinculoEmpresaService');

            $grupoVisualizacaoVeiculoService = $this->getService('Application\Service\GrupoVisualizacaoVeiculoService');
            $sistemaRegistroService = $this->getService('Application\Service\SistemaRegistroService');
            $historicoPesquisaService = $this->getService('Application\Service\HistoricoPesquisaService');
            $imagemSistemaService = $this->getService('Application\Service\ImagemSistemaService');


            $session = $this->getService('Session');

            $session->offsetSet('user', $usua);
            $session->offsetSet('userName', $usua->getPessoa()->getNome());
            $session->offsetSet('grupoVisualizacao', $usua->getGrupoVisualizacao());
            $session->offsetSet('tipoSelecaoVeiculo', $usua->getGrupoVisualizacao()->getTipoSelecao());

            $session->offsetSet('tempoViagemTransitTime',
                $sistemaRegistroService->solicitaTempoViagemTransitTime('TEMPO_VIAGEM_TRANSIT_TIME_'.$usua->getId())
            );

            $session->offsetSet('logoMenu', $imagemSistemaService->getPropriedadesImagem(
                $sistemaRegistroService->getValorByChaveAndSessao('IMG_MENU', 'TRAFEGUS_WEB_04_IMG_MENU') ?:
                    '/public/img/logo/trafegus_menu.png', 280, 51)
            );

            $session->offsetSet('logoRelatorio', $imagemSistemaService->getPropriedadesImagem(
                $sistemaRegistroService->getValorByChaveAndSessao('IMG_RELATORIO', 'TRAFEGUS_WEB_04_IMG_RELATORIO') ?:
                    '/public/img/logo/trafegus_relatorio.png', 200, 95)
            );

            $session->offsetSet('agruparVeiculos',
                $sistemaRegistroService->getValorByChave('TRAFEGUS_WEB_AGR_'.$usua->getId())
            );

            $session->offsetSet('tipoEmpresa', $usua->getLogin() == 'SUPORTE' ? 'GERENCIADORA' :
                $empresaService->getTipoEmpresa($usua->getEmpresa()->getId())
            );

            $session->offsetSet('menu', $menuService->getMenuUsuario());

            $vinculoEmpresaService->setEmpresasVinculadasSessao();

            $grupoVisualizacaoVeiculoService->setVeiculosDisponiveisSessao();

            $session->offsetSet('obrigaContatoMotora', $empresaService->getObrigaConaMotora($usua->getEmpresa()->getId()));

            $session->offsetSet('naoExcluiContatoMotora', $empresaService->getNaoExcluiConaMotora($usua->getEmpresa()->getId()));

            $cchp = $this->getEm()->find('Application\Model\ConfiguracaoChp', 1);
            $session->offsetSet('projetoSompo', $cchp->getHabilitaProjetoSompo());
            $session->offsetSet('obrigaPrevSm', $cchp->getObrigaPreenchPrevisaoSm());
            $session->offsetSet('permiteAlterarPrevSm', $cchp->getPermiteAlterarPrevisaoSm());
            $session->offsetSet('integraSistemaIcs', $cchp->getIntegrarApiSistemaIcs());
            $session->offsetSet('multiplasDdr', $cchp->getUsarMultiplasDdr());

            $session->offsetSet('fornecedorPesquisa', $historicoPesquisaService->getFornecedorPesquisa());

            $empresa =  $this->getEm()->find('Application\Model\ObjetoRastreado', $usua->getEmpresa()->getId());
            $session->offsetSet('pgrPadrao', $empresa->getPlanoGr() ? $empresa->getPlanoGr()->getId() : -99);

            $session->offsetSet('tipoBaseMapa', 'osm');

            $session->offsetSet('googleMapsApiKey', $cchp->getApikeyWeb());

            $session->offsetSet('mapBoxApiKey', $cchp->getApikeyMapBox());

            $session->offsetSet('utilizaHotStandBy', $cchp->getUtilizaHotStandBy() == 'S' ? 1 : 0);
            $session->offsetSet('tipoMenu', $cchp->getTipoMenu());

            $session->offsetSet('linkServidorOpenstreetMaps', $cchp->getLinkServidorOpenstreetMaps() ? $cchp->getLinkServidorOpenstreetMaps()  : '');
            $session->offsetSet('linkOpenstreetMapsEnderecos', $cchp->getLinkOpenstreetmapsEnderecos());
            $session->offsetSet('linkOpenstreetMapsRotas', $cchp->getLinkOpenstreetmapsRotas());

            $session->setAuthenticationExpirationTime($usua->getTempoSessaoWeb());

            return 'SUCESSO_LOGIN';
        } else if (!$authResult->isValid()){
            return 'ERRO_AUTENTICACAO';
        } else if (!$authResult->getIdentity()->getPerfil()){
            return 'SEM_PERFIL';
        } else if (!$authResult->getIdentity()->getGrupoVisualizacao()){
            return 'SEM_GRUPO_VISUALIZACAO';
        } else if ($authResult->getIdentity()->getObjetoRastreado()->getStatus()->getId() != 1){
            return 'USUARIO_INATIVO';
        }
    }
}