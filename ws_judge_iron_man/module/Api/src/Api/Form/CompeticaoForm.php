<?php


namespace Api\Form;


use Zend\Form\Form;

class CompeticaoForm extends Form
{
    public function __construct($name = null)
    {
        parent::__construct('form_competicao');

        $this->add(array(
            'name' => 'id',
            'type' => 'Hidden',
        ));
        $this->add(array(
            'name' => 'motocicleta',
            'type' => 'Text',
            'options' => array(
                'label' => 'motocicleta',
            )
        ));

        $this->add(array(
            'name' => 'key',
            'type' => 'Text',
            'options' => array(
                'label' => 'Data Passou',
            ),
        ));

    }


}