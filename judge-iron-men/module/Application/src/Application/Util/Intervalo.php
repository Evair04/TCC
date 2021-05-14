<?php

namespace Application\Util;

/**
 * Classe para manipular intervalos
 *
 * OBS: A resolução de tempo dessa classe é de segundos
 * @package Application\Util
 */
class Intervalo
{
    const REGEX_INTERVALO_COMPLETO = '/(-)?(\d+):(\d{2}):(\d{2})/';
    const REGEX_INTERVALO = '/(-)?(\d+):(\d{2})/';

    public static function isValid($texto) {
        return preg_match(self::REGEX_INTERVALO_COMPLETO, $texto);
    }

    /**
     * Converte um intervalo no formato H:i:s para um intervalo
     *
     * @param $texto string intervalo no formato H:i:s
     * @return Intervalo
     */
    public static function createFromHoraMinutoSegundo($texto, $default= null)
    {
        $isMatching = preg_match(self::REGEX_INTERVALO_COMPLETO, $texto, $matches);
        if (!$isMatching) {
            if ($default){
                return $default;
            }
            throw new \InvalidArgumentException(INTERVALO_INVALIDO);
        }

        $valor = $matches[2] * 3600 + $matches[3] * 60 + $matches[4];
        if ($matches[1]) {
            $valor = $valor * -1;
        }

        return new Intervalo($valor);
    }

    /**
     * Converte um intervalo no formato H:i:s para um intervalo
     *
     * @param $texto string intervalo no formato H:i
     * @return Intervalo
     */
    public static function createFromHoraMinuto($texto, $default = null)
    {
        $isMatching = preg_match(self::REGEX_INTERVALO, $texto, $matches);
        if (!$isMatching) {
            if ($default){
                return $default;
            }
            throw new \InvalidArgumentException(INTERVALO_INVALIDO);
        }

        $valor = $matches[2] * 3600 + $matches[3] * 60;
        $matches[1] && $valor *= -1;

        return new Intervalo($valor);
    }

    /**
     * Cria um novo intervalo com a quantidade de segundos informada
     *
     * @param $segundos integer quantidade de segundos do intervalo
     * @return Intervalo
     */
    public static function createFromSegundos($segundos)
    {
        return new Intervalo($segundos);
    }

    /**
     * Retorna um intervalo zerado
     * @return Intervalo
     */
    public static function zero()
    {
        return new Intervalo(0);
    }

    /**
     * @var integer valor em segundos do intervalo
     */
    private $valor;

    private function __construct($valor)
    {
        $this->valor = $valor;
    }

    /**
     * Converte o intervalo para o formato H:i:s
     * @param bool $formatted mantém ou remove a formatação de horário
     * @param bool $secondsIncluded mantém ou remove os segundos do tempo
     * @return string intervalo formatado conforme parâmetros (padrão H:i:s)
     */
    public function toHoraMinutoSegundo($formatted = true, $secondsIncluded = true)
    {
        $valor = abs($this->valor);
        $sinal = $this->valor < 0 ? '-' : '';
        $tempo = [
            'horas' => str_pad(floor($valor / 3600), 2, '0', STR_PAD_LEFT),
            'minutos' => str_pad(floor(($valor / 60) % 60), 2, '0', STR_PAD_LEFT),
            'segundos' => str_pad(floor($valor % 60), 2, '0', STR_PAD_LEFT)
        ];

        if (!$secondsIncluded){
            unset($tempo['segundos']);
        }

        return $sinal . implode($formatted ? ':' : '', $tempo);
    }

    /**
     * Retorna um novo intervalo representando a soma dos intervalos
     *
     * @param Intervalo $intervalo
     * @return Intervalo
     */
    public function somar(Intervalo $intervalo)
    {
        return new Intervalo($intervalo->valor + $this->valor);
    }

    /**
     * Retorna um novo intervalo representando a soma dos intervalos
     *
     * @param Intervalo $intervalo
     * @return Intervalo
     */
    public function somarDefault(Intervalo $intervalo, $valor)
    {
        if (!$intervalo){
            return new Intervalo($this->valor + $valor);
        }
        return new Intervalo($intervalo->valor + $this->valor);
    }

    /**
     * Retorna um novo intervalo representando a diferença dos intervalos
     *
     * @param Intervalo $intervalo
     * @return Intervalo
     */
    public function subtrair(Intervalo $intervalo)
    {
        return new Intervalo($this->valor - $intervalo->valor);
    }

    /**
     * Verifica se o intervalo é maior que outro intervalo
     *
     * @param Intervalo $intervalo
     * @return boolean
     */
    public function maiorQue(Intervalo $intervalo)
    {
        return $this->valor > $intervalo->valor;
    }

    /**
     * Verifica se o intervalo é maior ou igual ao outro intervalo
     *
     * @param Intervalo $intervalo
     * @return boolean
     */
    public function maiorQueIgual(Intervalo $intervalo)
    {
        return $this->valor >= $intervalo->valor;
    }

    /**
     * Verifica se o intervalo é menor que o outro intervalo
     *
     * @param Intervalo $intervalo
     * @return boolean
     */
    public function menorQue(Intervalo $intervalo)
    {
        return $this->valor < $intervalo->valor;
    }

    /**
     * Verifica se o intervalo é menor ou igual a outro intervalo
     *
     * @param Intervalo $intervalo
     * @return boolean
     */
    public function menorQueIgual(Intervalo $intervalo)
    {
        return $this->valor <= $intervalo->valor;
    }

    /**
     * Retorna a quantidade de segundos desse intervalo
     *
     * @return integer
     */
    public function emSegundos()
    {
        return $this->valor;
    }

    public function igual(Intervalo $intervalo)
    {
        return $this->valor === $intervalo->valor;
    }

    public function diferente(Intervalo $intervalo)
    {
        return $this->valor !== $intervalo->valor;
    }
}