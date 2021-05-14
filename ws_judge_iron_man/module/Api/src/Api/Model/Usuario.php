<?php

namespace Api\Model;

use Doctrine\ORM\Mapping as ORM;
use Zend\InputFilter\InputFilter;
use Zend\InputFilter\InputFilterInterface;
use Zend\Validator\Hostname;

/**
 * Usuário do sistema.
 *
 * @ORM\Entity
 * @ORM\Table(name="usua_usuario")
 */
class Usuario
{
    /**
     * @ORM\Id
     * @ORM\Column(type="integer", name="usua_codigo")
     */
    protected $id;

    /**
     * @ORM\Column(type="string", name="usua_login", length=30)
     */
    protected $login;

    /**
     * @ORM\Column(type="string", name="usua_senha", length=20)
     */
    protected $senha;



    /**
     * @ORM\Column(type="datetime", name="usua_data_cadastro")
     */
    protected $dataCadastro;



    /**
     * @ORM\Column(type="string", name="usua_email", length=100)
     */
    protected $email;

    /**
     * @return mixed
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @param mixed $id
     */
    public function setId($id)
    {
        $this->id = $id;
    }

    /**
     * @return mixed
     */
    public function getLogin()
    {
        return $this->login;
    }

    /**
     * @param mixed $login
     */
    public function setLogin($login)
    {
        $this->login = $login;
    }

    /**
     * @return mixed
     */
    public function getSenha()
    {
        return $this->senha;
    }

    /**
     * @param mixed $senha
     */
    public function setSenha($senha)
    {
        $this->senha = $senha;
    }

    /**
     * @return mixed
     */
    public function getDataCadastro()
    {
        return $this->dataCadastro;
    }

    /**
     * @param mixed $dataCadastro
     */
    public function setDataCadastro($dataCadastro)
    {
        $this->dataCadastro = $dataCadastro;
    }

    /**
     * @return mixed
     */
    public function getEmail()
    {
        return $this->email;
    }

    /**
     * @param mixed $email
     */
    public function setEmail($email)
    {
        $this->email = $email;
    }



    public function exchangeArray($data){
        $this->pessoa = (!empty($data['pessoa'])) ? $data['pessoa'] : $this->pessoa;
        $this->empresa = (!empty($data['empresa'])) ? $data['empresa'] : $this->empresa;
        $this->perfil = (!empty($data['perfil'])) ? $data['perfil'] : $this->perfil;
        $this->grupoVisualizacao = (!empty($data['grupoVisualizacao'])) ? $data['grupoVisualizacao'] : $this->grupoVisualizacao;
        $this->login = (!empty($data['login'])) ? strtoupper($data['login']) : $this->login;
        $this->senha = (!empty($data['senha'])) ? strtoupper($data['senha']) : $this->senha;
        $this->email = (!empty($data['email'])) ? strtoupper($data['email']) : $this->email;
        $this->tempoSessaoWeb = (!empty($data['tempoSessaoWeb'])) ? $data['tempoSessaoWeb'] : $this->tempoSessaoWeb;
        $this->dataCadastro = (!empty($data['dataCadastro'])) ? $data['dataCadastro'] : new \DateTime('now');
    }

    public function getArrayCopy()
    {
        return get_object_vars($this);
    }

    public function setInputFilter(InputFilterInterface $inputFilter)
    {
        throw new \Exception("Not used");
    }

    public function getInputFilter()
    {
        $inputFilter = new InputFilter();

        $inputFilter->add(array(
            'name'     => 'pessoa',
            'required' => false,
            'filters'  => array(
                array('name' => 'Int'),
            ),
        ));

        $inputFilter->add(array(
            'name'     => 'empresa',
            'required' => true,
            'filters'  => array(
                array('name' => 'Int'),
            ),
        ));

        $inputFilter->add(array(
            'name'     => 'perfil',
            'required' => true,
            'filters'  => array(
                array('name' => 'Int'),
            ),
        ));

        $inputFilter->add(array(
            'name'     => 'grupoVisualizacao',
            'required' => true,
            'filters'  => array(
                array('name' => 'Int'),
            ),
        ));

        $inputFilter->add(array(
            'name'     => 'tempoSessaoWeb',
            'required' => true,
            'filters'  => array(
                array('name' => 'Int'),
            ),
            'validators' => array(
                array(
                    'name'    => 'Between',
                    'options' => array(
                        'min' => 5,
                        'max' => 1440,
                    ),
                )
            ),
        ));

        $inputFilter->add(array(
            'name'     => 'email',
            'required' => true,
            'filters'  => array(
                array('name' => 'StripTags'),
                array('name' => 'StringTrim'),
                array('name' => 'Application\Model\Filters\RemoverCaracteresEspeciais'),
            ),
            'validators' => array(
                array(
                    'name'    => 'StringLength',
                    'options' => array(
                        'encoding' => 'UTF-8',
                        'min'      => 1,
                        'max'      => 100,
                    ),
                ),
                array(
                    'name'    => 'EmailAddress',
                    'options' => array(
                        'allow' => Hostname::ALLOW_DNS,
                    ),
                ),
            ),
        ));

        $inputFilter->add(array(
            'name'     => 'login',
            'required' => true,
            'filters'  => array(
                array('name' => 'StripTags'),
                array('name' => 'StringTrim'),
                array('name' => 'StringToUpper'),
                array('name' => 'Application\Model\Filters\RemoverCaracteresEspeciais'),
            ),
            'validators' => array(
                array(
                    'name'    => 'StringLength',
                    'options' => array(
                        'encoding' => 'UTF-8',
                        'max'      => 200,
                    ),
                ),
            ),
        ));

        $inputFilter->add(array(
            'name'     => 'senha',
            'required' => true,
            'filters'  => array(
                array('name' => 'StripTags'),
                array('name' => 'StringTrim'),
                array('name' => 'StringToUpper'),
                array('name' => 'Application\Model\Filters\RemoverCaracteresEspeciais'),
            ),
            'validators' => array(
                array(
                    'name'    => 'StringLength',
                    'options' => array(
                        'encoding' => 'UTF-8',
                        'max'      => 20,
                    ),
                ),
            ),
        ));

        return $inputFilter;
    }
}