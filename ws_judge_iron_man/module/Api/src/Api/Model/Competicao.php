<?php

namespace Api\Model;
use Doctrine\ORM\Mapping as ORM;
use Zend\InputFilter\InputFilter;
use Zend\InputFilter\InputFilterAwareInterface;
use Zend\InputFilter\InputFilterInterface;

/**
 * DESCRIÇÃO DA MODEL
 * Contatos do sistema
 *
 * @ORM\Entity
 * @ORM\Table(name="comp_competicao")

 */
class Competicao implements InputFilterAwareInterface
{
	/**
	 * @ORM\Id
	 * @ORM\Column(type="integer", name="comp_codigo")
     * @ORM\GeneratedValue(strategy="SEQUENCE")
     * @ORM\SequenceGenerator(sequenceName="public.s_comp_competicao", allocationSize=1, initialValue=1)
     *
	 */
	protected $id;

	/**
	 * @ORM\Column(type="string", name="comp_identificador", length=50)
	 */
	protected $identificador;

    /**
     * @ORM\Column(type="datetime", name="comp_data_cadastro")
     */
    protected $dataCadastro;

    /**
     * @ORM\Column(type="datetime", name="comp_tempo_inicial")
     */
    protected $dataInicial;

    /**
     * @ORM\Column(type="datetime", name="comp_tempo_final")
     */
    protected $dataFinal;

    /**
     * @ORM\Column(type="string", name="comp_tempo_total")
     */
    protected $tempoTotal;

    /**
     * @ORM\Column(type="integer", name="comp_pista")
     */
    protected $pista;

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
    public function getIdentificador()
    {
        return $this->identificador;
    }

    /**
     * @param mixed $identificador
     */
    public function setIdentificador($identificador)
    {
        $this->identificador = $identificador;
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
    public function getDataInicial()
    {
        return $this->dataInicial;
    }

    /**
     * @param mixed $dataInicial
     */
    public function setDataInicial($dataInicial)
    {
        $this->dataInicial = $dataInicial;
    }

    /**
     * @return mixed
     */
    public function getDataFinal()
    {
        return $this->dataFinal;
    }

    /**
     * @param mixed $dataFinal
     */
    public function setDataFinal($dataFinal)
    {
        $this->dataFinal = $dataFinal;
    }

    /**
     * @return mixed
     */
    public function getTempoTotal()
    {
        return $this->tempoTotal;
    }

    /**
     * @param mixed $tempoTotal
     */
    public function setTempoTotal($tempoTotal)
    {
        $this->tempoTotal = $tempoTotal;
    }

    /**
     * @return mixed
     */
    public function getPista()
    {
        return $this->pista;
    }

    /**
     * @param mixed $pista
     */
    public function setPista($pista)
    {
        $this->pista = $pista;
    }

    public function setInputFilter(InputFilterInterface $inputFilter)
    {
        throw new \Exception("Not used");
    }

    public function getInputFilter()
    {
        $inputFilter = new InputFilter();

        $inputFilter->add(array(
            'name'     => 'id',
            'required' => false,
            'filters'  => array(
                array('name' => 'Int'),
            ),
        ));
        $inputFilter->add(array(
            'name'     => 'motocicleta',
            'required' => true,
            'filters'  => array(
                array('name' => 'StripTags'),
                array('name' => 'StringTrim'),
                array('name' => 'StringToUpper'),
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
            ),
        ));
        $inputFilter->add(array(
            'name'     => 'key',
            'required' => false,
            'filters'  => array(
                array('name' => 'StripTags'),
                array('name' => 'StringTrim'),
                array('name' => 'StringToUpper'),
            ),
            'validators' => array(
                array(
                    'name'    => 'StringLength',
                    'options' => array(
                        'encoding' => 'UTF-8',
                        'min'      => 0,
                        'max'      => 30,
                    ),
                ),
            ),
        ));



        return $inputFilter;
    }

}
