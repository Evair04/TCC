<?php
/**
 * Created by PhpStorm.
 * User: sl
 * Date: 20/09/17
 * Time: 09:35
 */

namespace Api\Form;


use Zend\Form\Form;

class VeiculoForm extends Form
{
    public function __construct($name = null)
    {

        parent::__construct('veiculo');
        // var_dump($name);exit;
        $this->add(array(
            'name' => 'veic_codigo',
            'type' => 'Hidden',
        ));

        $this->add(array(
            'name' => 'placa',
            'type' => 'Text',

        ));

        $this->add(array(
            'name' => 'frota',
            'type' => 'Text',

        ));

        $this->add(array(
            'name' => 'escolta',
            'type' => 'Text',

        ));

        $this->add(array(
            'name' => 'renavam',
            'type' => 'Text',

        ));

        $this->add(array(
            'name' => 'chassi',
            'type' => 'Text',

        ));

        $this->add(array(
            'name' => 'tipo_veiculo',
            'type' => 'Text',

        ));

        $this->add(array(
            'name' => 'documento_proprietario',
            'type' => 'Text',

        ));

        $this->add(array(
            'name' => 'documento_transportador',
            'type' => 'Text',

        ));

        $this->add(array(
            'name' => 'senha_proprietario',
            'type' => 'Text',

        ));

        $this->add(array(
            'name' => 'senha_coacao',
            'type' => 'Text',

        ));

        $this->add(array(
            'name' => 'modelo',
            'type' => 'Text',

        ));

        $this->add(array(
            'name' => 'marca',
            'type' => 'Text',

        ));

        $this->add(array(
            'name' => 'cpf_motorista',
            'type' => 'Text',

        ));

        $this->add(array(
            'name' => 'ano_fabricacao',
            'type' => 'Text',

        ));

        $this->add(array(
            'name' => 'ano_modelo',
            'type' => 'Text',

        ));

        $this->add(array(
            'name' => 'cor',
            'type' => 'Text',

        ));

        $this->add(array(
            'name' => 'tamanho',
            'type' => 'Text',

        ));

        $this->add(array(
            'name' => 'cidade_emplacamento',
            'type' => 'Text',

        ));

        $this->add(array(
            'name' => 'sigla_estado',
            'type' => 'Text',

        ));

        $this->add(array(
            'name' => 'pais',
            'type' => 'Text',

        ));

        $this->add(array(
            'name' => 'telefone',
            'type' => 'Text',

        ));

        $this->add(array(
            'name' => 'antt',
            'type' => 'Text',

        ));

        $this->add(array(
            'name' => 'rntc',
            'type' => 'Text',

        ));

        $this->add(array(
            'name' => 'crlv',
            'type' => 'Text',

        ));

        $this->add(array(
            'name' => 'observacao_veiculo',
            'type' => 'Text',

        ));






    }
}