<?php
 namespace Application\Form;

 use Zend\Form\Form;

 class LoginForm extends Form
 {
     public function __construct($name = null)
     {

         parent::__construct('login');


         $this->add(array(
             'name' => 'login',
             'type' => 'Text',
             'options' => array(
                 'label' => 'Login',
                 'label_attributes' => array(
                     'class'  => 'control-label',
                     'for'  => 'usua_login'
                 ),
             ),
             'attributes' => array(
                 'id'     => 'usua_login',
                 'class'  => 'form-control',
                 'maxlength' => 200,
             )
         ));
         $this->add(array(
             'name' => 'senha',
             'type' => 'Password',
             'options' => array(
                 'label' => SENHA,
                 'label_attributes' => array(
                     'class'  => 'control-label',
                     'for'  => 'usua_senha'
                 ),
             ),
             'attributes' => array(
                 'id'     => 'usua_senha',
                 'class'  => 'form-control',
                 'maxlength' => 20,
             )
         ));

         $this->add(array(
             'name' => 'submit',
             'type' => 'Submit',
             'attributes' => array(
                 'value' => mb_strtoupper(ACESSAR),
                 'class' => 'btn btn-default btn-raised'
             ),
         ));
     }
 }
