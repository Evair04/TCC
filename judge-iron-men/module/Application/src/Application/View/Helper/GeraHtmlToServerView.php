<?php

namespace Application\View\Helper;

use Zend\View\Helper\AbstractHelper;

class GeraHtmlToServerView extends AbstractHelper
{
    // Classe destinada a funções de geração de html para services e controllers
    public function getEmailChecklist($data, $veiculos, $terminais){
        $message = '<div style="font-family: verdana;float:left;">'
            . $data['mensagem'] .
            '<br/><br/>
            <fieldset>
            <legend style="font-size: 17px;">' . DETALHES . '</legend>
            <div style="margin: 10px;">
            <table cellspacing="8" style="float:left;">
                <tr>
                    <td><b>' . VEICULO . ' ' . CAVALO . ': </b></td>
                    <td>' . $data['veiculoPlaca'] . '</td>
                </tr>
                <tr>
                    <td><b>' . VEICULO . ' ' . CARRETA . ': </b></td>
                    <td>' . ($data['carretaPlaca'] ? $data['carretaPlaca'] : 'N/A') . '</td>
                </tr>
                <tr>
                    <td><b>' . PROPRIETARIO . ': </b></td>
                    <td>' . $data['checklist']->getProprietario()->getNome() . '</td>
                </tr>
                <tr>
                    <td><b>' . RESPONSAVEL . ': </b></td>
                    <td>' . ($data['checklist']->getNomeResponsavel() ? $data['checklist']->getNomeResponsavel() : 'N/A') . '</td>
                </tr>
                <tr>
                    <td><b>' . VALIDADE . ': </b></td>
                    <td>' . ($data['checklist']->getDataValidade() ? $data['checklist']->getDataValidade()->format('d/m/Y H:i:s') : '') . '</td>
                </tr>
                <tr>
                    <td><b>' . APROVADO . ': </b></td>
                    <td>' . ($data['checklist']->getAprovado() == 'S' ? mb_strtoupper(SIM) : mb_strtoupper(NAO)) . '</td>
                </tr>
            </table>
            <table cellspacing="8" style="padding-left: 40px;">
                <tr>
                    <td><b>' . TERMINAL . ': </b></td>
                    <td>' . $data['terminalNumero'] . '</td>
                </tr>
                <tr>
                    <td><b>' . MOTORISTA . ': </b></td>
                    <td>' . ($data['motorista'] ? $data['motorista']->getNome() : 'N/A') . '</td>
                </tr>
                <tr>
                    <td><b>' . VIAGEM . ': </b></td>
                    <td>' . ($data['viagem'] ? $data['viagem']->getId().' - '.$data['viagemDataPrevInicio'].' - '.$data['viagemDataPrevFim'] : 'N/A') . '</td>
                </tr> 
                <tr>
                    <td><b>' . TIPO_CHECKLIST . ': </b></td>
                    <td>' . $data['checklist']->getTipo() . '</td>
                </tr>
                <tr>
                    <td><b>' . MOTIVO_RECUSA . ': </b></td>
                    <td>' . ($data['checklist']->getMotivoRecusa() ? $data['checklist']->getMotivoRecusa() : 'N/A') . '</td>
                </tr>
                <tr>
                    <td><b>' . ATIVO . ': </b></td>
                    <td>' . ($data['checklist']->getAtivo() == 'S' ? mb_strtoupper(SIM) : mb_strtoupper(NAO)) . '</td>
                </tr>
            </table>
            </div>
            </fieldset>

            <fieldset style="margin-top:20px;">
                <legend style="font-size: 18px;">' . TERMINAIS . '</legend>
                <div style="margin: 10px;">
            ';

        foreach ($terminais as $t) { //Aqui
            $t = (array) $t;
            $t['numero'] = substr($t['text'], strrpos($t['text'], ' '));

            $message .= '
            <div style="font-size: 16px; margin-top: 10px; margin-bottom:15px;">
                <b>' . CODIGO . ':</b> ' . $t['id'] . '  <b style="margin-left: 10px;">' . NUMERO . ':</b> ' . $t['numero'] . '
            </div>
            <table cellspacing="0" style="font-size: 13px; text-align: left; margin-bottom: 60px;">
            <th>' . CODIGO . '</th>
            <th style="padding-left: 10px;">' . PERIFERICO . '</th>
            <th style="padding-left: 10px;">' . TIPO . '</th>
            <th style="padding-left: 10px;">' . INSTALADO . '</th>
            <th style="padding-left: 10px;">' . FUNCIONANDO . '</th>
            <th style="padding-left: 10px;">' . PROBLEMA . '</th>';
            $i = 0;
            foreach ($t['perifericos'] as $p) {
                $p = (array) $p;
                if ($i % 2 == 0) {
                    $estilo = "style='background-color: #E9E9E9;'";
                } else {
                    $estilo = '';
                }

                $message .= "<tr $estilo>
                                <td>{$p['id']}</td>
                                <td style='padding-left: 10px;'>{$p['ppad_descricao']}</td>
                                <td style='padding-left: 10px;'>{$p['tper_descricao']}</td>
                                <td style='padding-left: 10px;'>" . ($p['instalado'] ? mb_strtoupper(SIM) : mb_strtoupper(NAO)) . "</td>
                                <td style='padding-left: 10px;'>" . ($p['funcionando'] ? mb_strtoupper(SIM) : mb_strtoupper(NAO)) . "</td>
                                <td style='padding-left: 10px;'>{$p['problema']}</td>
                            </tr>";
                $i++;
            }
            $message .= '</table>';
        }
        $message .= '
        </div>
        </fieldset>
        <fieldset style="margin-top:20px;">
            <legend style="font-size: 18px;">' . VEICULOS . '</legend>
            <div style="margin: 10px;">';


        $veiculos = (array) $veiculos;
        foreach ($veiculos as $v) {
            $v = (array) $v;
            $v['placa'] = substr($v['text'], strrpos($v['text'], ' '));

            $message .= '
            <div style="font-size: 16px; margin-top: 10px; margin-bottom:15px;">
                <b>' . CODIGO . ':</b> ' . $v['id'] . '  <b style="margin-left: 10px;">' . PLACA . '</b> ' . $v['placa'] . '
            </div>
            <table cellspacing="0" style="font-size: 13px; text-align: left; margin-bottom: 60px;">
            <th>' . CODIGO . '</th>
            <th style="padding-left: 10px;">' . ACESSORIO . '</th>
            <th style="padding-left: 10px;">' . TIPO . '</th>
            <th style="padding-left: 10px;">' . INSTALADO . '</th>
            <th style="padding-left: 10px;">' . FUNCIONANDO . '</th>
            <th style="padding-left: 10px;">' . PROBLEMA . '</th>';
            $i = 0;
            foreach ($v['acessorios'] as $a) {
                $a = (array) $a;
                if ($i % 2 == 0) {
                    $estilo = "style='background-color: #E9E9E9;'";
                } else {
                    $estilo = '';
                }

                $message .= "<tr $estilo>
                                <td>{$a['apdr_codigo']}</td>
                                <td style='padding-left: 10px;'>{$a['apdr_descricao']}</td>
                                <td style='padding-left: 10px;'>{$a['tper_descricao']}</td>
                                <td style='padding-left: 10px;'>" . ($a['instalado'] ? mb_strtoupper(SIM) : mb_strtoupper(NAO)) . "</td>
                                <td style='padding-left: 10px;'>" . ($a['funcionando'] ? mb_strtoupper(SIM) : mb_strtoupper(NAO)) . "</td>
                                <td style='padding-left: 10px;'>{$a['problema']}</td>
                            </tr>";
                $i++;
            }
            $message .= '</table>';
        }
        $message .= '
        </div>
        </fieldset>';
        $message .= '</div>';
        return $message;
    }

    // Classe destinada a funções de geração de html para services e controllers
    public function getEmailRecuperarSenha($link, $tempoExpiracao){
        $message = '<div>
                        <label><strong>'.CLICK_PARA_REDEFINIR.'</strong></label><br>
                        <label>'.$link.'<label><br><br>
                        <label>'.sprintf(LINK_ATIVO_TEMPO, $tempoExpiracao).'</label>
                    </div>';
        return $message;
    }
    // Classe destinada a funções de geração de html para services e controllers
    public function getEmailAssociacoes($tipoAssociacao){
        $message = '<div>
                        <label><strong>'.SOLICITADO_ASSOCIACAO.'</strong></label><br>
                        <label>'.mb_strtoupper($tipoAssociacao).'<label><br><br>
                        <i> Esta é uma mensagem automática, sugerimos não responder este e-mail.</i>
                    </div>';
        return $message;
    }
    // Classe destinada a funções de geração de html para services e controllers
    public function getEmailDiarioBordo($conteudo){
        $message = "<div>
                        <strong> A Solicitação de Monitoramento do veículo {$conteudo['placa']} e motorista
        {$conteudo['nome']} não pôde ser efetivada pelos seguintes itens do diário de bordo
        estarem irregulares.</strong><br> Itens: ";
        $labels = [];
        foreach($conteudo['itens'] as $item){
            $labels[] = $item;
        }
        $message .= implode(', ', $labels) . ". </div>";

        return $message;
    }


}