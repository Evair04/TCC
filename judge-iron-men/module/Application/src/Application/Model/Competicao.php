<?php

namespace Application\Model;
use Base\Entity\AbstractEntity;
use Doctrine\ORM\Mapping as ORM;

/**
 * DESCRIÇÃO DA MODEL
 *
 * @ORM\Entity
 * @ORM\Table(name="comp_competicao")
 */
class Competicao extends AbstractEntity
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
     * @ORM\Column(type="integer", name="comp_pista")
     */
    protected $pista;

    /**
     * @ORM\Column(type="string", name="comp_identificador", length=20)
     */
    protected $identificador;

    /**
     * @ORM\Column(type="datetime", name="comp_data_cadastro")
     */
    protected $dataCadastro;

    /**
     * @ORM\Column(type="datetime", name="comp_tempo_inicial")
     */
    protected $tempoInicial;

    /**
     * @ORM\Column(type="datetime", name="comp_tempo_final")
     */
    protected $tempoFinal;

    /**
     * @ORM\Column(type="string", name="comp_tempo_total", length=20)
     */
    protected $tempoTotal;

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
    public function getTempoInicial()
    {
        return $this->tempoInicial;
    }

    /**
     * @param mixed $tempoInicial
     */
    public function setTempoInicial($tempoInicial)
    {
        $this->tempoInicial = $tempoInicial;
    }

    /**
     * @return mixed
     */
    public function getTempoFinal()
    {
        return $this->tempoFinal;
    }

    /**
     * @param mixed $tempoFinal
     */
    public function setTempoFinal($tempoFinal)
    {
        $this->tempoFinal = $tempoFinal;
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

}
