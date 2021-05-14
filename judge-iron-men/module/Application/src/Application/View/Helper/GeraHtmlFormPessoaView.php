<?php

namespace Application\View\Helper;

use Zend\View\Helper\AbstractHelper;

class GeraHtmlFormPessoaView extends AbstractHelper
{
    public function getFormPessoaCompleto($formRenderer, $formObjetoRastreado, $formPessoa, $formPessoaFisica, $formPessoaJuridica){
        $col_md = 'col-md-9';
        $buscaAvancada = BUSCA_AVANCADA;
        $stringHtml = "<div class='row'>";


        /////////////////////////////////////////////////// 1ª ROW //////////////////////////////////////////////////
        $statusSelect = $formObjetoRastreado->get('status');
        if($statusSelect->getValue()){
            $statusSelect->setValue($statusSelect->getValue()->getId());
        }

        if ($formRenderer->tipoEmpresa == 'GERENCIADORA'){
            $col_md = 'col-md-6';
            $stringHtml .=
                "<div class='col-md-3 m-t-menos-15 form-group'>
                    {$formRenderer->formRow($statusSelect)}
                </div>";
        }

        $planoGrSelect = $formObjetoRastreado->get('planoGr');
        if($planoGrSelect->getValue()){
            $planoGrSelect->setValueOptions(array(
                $planoGrSelect->getValue()->getId() => "{$planoGrSelect->getValue()->getDescricao()}"
            ));
        }

        $stringHtml .=
            "<div class='$col_md m-t-menos-15 form-group'>
                <div class='input-group'>              
                    {$formRenderer->formRow($planoGrSelect)}
                    <span class='input-group-btn btn-lupa'>
                         <a id='btnModalPlanoGr' class='btn btn-default btn-lupa btn-raised m-t-40' title='{$buscaAvancada}'><i class='fa fa-search'></i></a>
                    </span>
                </div>
            </div>
            <div class='col-md-3 form-group label-floating'>
                {$formRenderer->formRow($formPessoa->get('tipo'))}
                {$formRenderer->formRow($formPessoa->get('id'))}
            </div></div>";


        /////////////////////////////////////////////////// 2ª ROW //////////////////////////////////////////////////
        $documentoHtml =
            "<div class='col-md-3 pfis form-group label-floating'>
                {$formRenderer->formRow($formPessoaFisica->get('cpf'))}
            </div>
            <div class='col-md-3 pjur form-group label-floating'>
                {$formRenderer->formRow($formPessoaJuridica->get('cnpj'))}
            </div>";

        $stringHtml .=
            "<div class='row'>
                $documentoHtml
                <div class='col-md-9 form-group label-floating is-empty'>
                    {$formRenderer->formRow($formPessoa->get('nome'))}
                </div>
            </div>";

        $stringHtml .= $this->getFormPessoaFisica($formRenderer, $formPessoaFisica, true);
        $stringHtml .= $this->getFormPessoaJuridica($formRenderer, $formPessoaJuridica, true);
        $stringHtml .= $this->getFormPessoa($formRenderer, $formPessoa, true);


        return $stringHtml;
    }

    public function getFormObjetoRastreado($formRenderer, $formObjetoRastreado){
        $col_md = 'col-md-9';
        $buscaAvancada = BUSCA_AVANCADA;
        $stringHtml = "<div class='row'>";


        $statusSelect = $formObjetoRastreado->get('status');
        if($statusSelect->getValue()){
            $statusSelect->setValue($statusSelect->getValue()->getId());
        }

        if ($formRenderer->tipoEmpresa == 'GERENCIADORA'){
            $col_md = 'col-md-6';
            $stringHtml .=
                "<div class='col-md-3 m-t-menos-15 form-group'>
                {$formRenderer->formRow($statusSelect)}
            </div>";
        }

        $planoGrSelect = $formObjetoRastreado->get('planoGr');
        if($planoGrSelect->getValue()){
            $planoGrSelect->setValueOptions(array(
                $planoGrSelect->getValue()->getId() => "{$planoGrSelect->getValue()->getDescricao()}"
            ));
        }

        $stringHtml .=
            "<div class='$col_md m-t-menos-15 form-group'>
                <div class='input-group'>              
                    {$formRenderer->formRow($planoGrSelect)}
                    <span class='input-group-btn btn-lupa'>
                         <a id='btnModalPlanoGr' class='btn btn-default btn-lupa btn-raised m-t-40' title='{$buscaAvancada}'><i class='fa fa-search'></i></a>
                    </span>
                </div>
            </div>";

        return $stringHtml;
    }

    public function getFormPessoa($formRenderer, $formPessoa, $formCompleto = false){
        $buscaAvancada = BUSCA_AVANCADA;

        if(!$formCompleto) {
            $stringHtml =
                "{$formRenderer->formRow($formPessoa->get('id'))}
                <div class='row'>
                    <div class='col-md-12 form-group label-floating is-empty'>
                        {$formRenderer->formRow($formPessoa->get('nome'))}
                    </div>
                </div>";
        }


        $cep = null;
        $logradouroSelect = $formPessoa->get('logradouro');
        if($logradouroSelect->getValue()){
            $cep = $logradouroSelect->getValue()->getCep();
            $bairro = !empty($logradouroSelect->getValue()->getBairro()) ? $logradouroSelect->getValue()->getBairro() : null;
            $bairroDescricao = $bairro ? $bairro->getDescricao() : '';
            $cidadeDescricao = $bairro && $bairro->getCidade() ? $bairro->getCidade()->getDescricao() : '';
            $logradouroSelect ->setValueOptions(array(
                $logradouroSelect->getValue()->getId() => "{$logradouroSelect->getValue()->getDescricao()}
                ({$bairroDescricao} - {$cidadeDescricao})"
            ));
        }


        $stringHtml .=
        "<div class='row'>
            <div class='col-md-6 m-t-menos-15 form-group'>
                <div class='input-group'>
                    {$formRenderer->formRow($logradouroSelect)}
                    <span class='input-group-btn btn-lupa'>
                        <a id='btnModalLogradouro' class='btn btn-default btn-lupa btn-raised m-t-40' title='{$buscaAvancada}'><i class='fa fa-search'></i></a>
                    </span>
                </div>
            </div>
            <div class='col-md-2 form-group label-floating is-empty'>
                <label class='control-label' for='cep'>Cep</label>
                <input class='change block-change form-control' disabled='true' name='cep' id='pess_cep' type='text' value='$cep'>
            </div>
            <div class='col-md-1 form-group label-floating is-empty'>
                {$formRenderer->formRow($formPessoa->get('numero'))}
            </div>
            <div class='col-md-3 form-group label-floating is-empty'>
                {$formRenderer->formRow($formPessoa->get('complemento'))}
            </div>
        </div>";

        return $stringHtml;
    }

    public function getFormPessoaFisica($formRenderer, $formPessoaFisica, $formCompleto = false){
        $col_md = 'col-md-3';
        $col_md_1 = 'col-md-6';
        $cpfHtml = '';
        $buscaAvancada = BUSCA_AVANCADA;

        $estadoEmissorRg = $formPessoaFisica->get('estadoEmissorRg');
        if($estadoEmissorRg->getValue()){
            $estadoEmissorRg->setValueOptions(array(
                $estadoEmissorRg->getValue()->getId() => "{$estadoEmissorRg->getValue()->getId()}
                    ({$estadoEmissorRg->getValue()->getSigla()} - {$estadoEmissorRg->getValue()->getdescricao()})"
            ));
        }

        $cidadeNaturalidadeSelect = $formPessoaFisica->get('naturalidade');
        if($cidadeNaturalidadeSelect->getValue()){
            $cidadeNaturalidadeSelect->setValueOptions(array(
                $cidadeNaturalidadeSelect->getValue()->getId() => "{$cidadeNaturalidadeSelect->getValue()->getDescricao()} (
                    {$cidadeNaturalidadeSelect->getValue()->getEstado()->getSigla()} - 
                    {$cidadeNaturalidadeSelect->getValue()->getEstado()->getPais()->getDescricao()})"
            ));
        }

        $dataNascimento = $formPessoaFisica->get('dataNascimento');
        $dataNascimento->setValue($dataNascimento->getValue() ? $dataNascimento->getValue()->format('d/m/Y') : '');

        $stringHtml =
        "<div class='row pfis'>
            <div class='col-md-3 form-group label-floating is-empty'>
                {$formRenderer->formRow($formPessoaFisica->get('rg'))}
            </div>
            <div class='col-md-3 form-group label-floating is-empty'>
                {$formRenderer->formRow($formPessoaFisica->get('orgaoEmissor'))}
            </div>
            <div class='col-md-6 m-t-menos-15 form-group'>
                <div class='input-group'>
                    {$formRenderer->formRow($estadoEmissorRg)}
                    <span class='input-group-btn btn-lupa'>
                        <a id='btnModalEstadoEmissor' class='btn btn-default btn-lupa btn-raised m-t-40' title='{$buscaAvancada}'><i class='fa fa-search'></i></a>
                    </span>
                </div>
            </div>
        </div>";

        $stringHtml .= "";

        if(!$formCompleto){
            $col_md = 'col-md-2';
            $col_md_1 = 'col-md-5';

            $cpfHtml =
                "<div class='col-md-3 form-group label-floating is-empty'>
                    {$formRenderer->formRow($formPessoaFisica->get('cpf'))}
                </div>";
        }

        $stringHtml .=
        "<div class='row pfis'>
            $cpfHtml
            <div class='$col_md m-t-menos-15 form-group'>
                {$formRenderer->formRow($formPessoaFisica->get('sexo'))}
            </div>
            <div class='$col_md form-group m-t-menos-15'>
                {$formRenderer->formRow($dataNascimento)}
            </div>
            <div class='$col_md_1 m-t-menos-15 form-group'>
                <div class='input-group'>              
                    {$formRenderer->formRow($cidadeNaturalidadeSelect)}
                    <span class='input-group-btn btn-lupa'>
                         <a id='btnModalCidadeNaturalidade' class='btn btn-default btn-lupa btn-raised m-t-40' title='{$buscaAvancada}'><i class='fa fa-search'></i></a>
                    </span>
                </div>
            </div>
        </div>
        <div class='row pfis'>
            <div class='col-md-6 form-group label-floating is-empty'>
                {$formRenderer->formRow($formPessoaFisica->get('nomePai'))}
            </div>
            <div class='col-md-6 form-group label-floating is-empty'>
                {$formRenderer->formRow($formPessoaFisica->get('nomeMae'))}
            </div>
        </div>";

        return $stringHtml;
    }

    public function getFormPessoaJuridica($formRenderer, $formPessoaJuridica, $formCompleto = false){
        $col_md = 'col-md-9';
        $cnpjHtml = '';

        if(!$formCompleto){
            $col_md = 'col-md-6';

            $cnpjHtml =
                "<div class='col-md-3 form-group label-floating is-empty'>
                    {$formRenderer->formRow($formPessoaJuridica->get('cnpj'))}
                </div>";
        }

        $stringHtml = 
            "<div class='row pjur'>
                $cnpjHtml
                <div class='col-md-3 form-group label-floating is-empty'>
                    {$formRenderer->formRow($formPessoaJuridica->get('inscricaoEstadual'))}
                </div>
                <div class='$col_md form-group label-floating is-empty'>
                    {$formRenderer->formRow($formPessoaJuridica->get('razaoSocial'))}
                </div>
            </div>
            <div class='row pjur'>
                <div class='col-md-12 form-group label-floating is-empty'>
                    {$formRenderer->formRow($formPessoaJuridica->get('site'))}
                </div>
            </div>";
        
        return $stringHtml;
    }
}