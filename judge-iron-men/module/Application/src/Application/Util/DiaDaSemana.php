<?php

namespace Application\Util;

use http\Exception\InvalidArgumentException;

/**
 * Classe que representa um dia da semana
 *
 * @package Application\Util
 */
class DiaDaSemana
{
    /**
     * CONSIDERAR COMO PRIVATE
     * @var array
     */
    const __COMPLETO__ = [
        1 => SEGUNDA_COMPLETO,
        2 => TERCA_COMPLETO,
        3 => QUARTA_COMPLETO,
        4 => QUINTA_COMPLETO,
        5 => SEXTA_COMPLETO,
        6 => SABADO_COMPLETO,
        7 => DOMINGO_COMPLETO,
    ];

    /**
     * CONSIDERAR COMO PRIVATE
     * @var array
     */
    const __CURTO__ = [
        1 => SEGUNDA_CURTO,
        2 => TERCA_CURTO,
        3 => QUARTA_CURTO,
        4 => QUINTA_CURTO,
        5 => SEXTA_CURTO,
        6 => SABADO_CURTO,
        7 => DOMINGO_CURTO,
    ];

    /**
     * CONSIDERAR COMO PRIVATE
     * @var array
     */
    const __ABREVIADO__ = [
        1 => SEGUNDA_ABREVIACAO,
        2 => TERCA_ABREVIACAO,
        3 => QUARTA_ABREVIACAO,
        4 => QUINTA_ABREVIACAO,
        5 => SEXTA_ABREVIACAO,
        6 => SABADO_ABREVIACAO,
        7 => DOMINGO_ABREVIACAO,
    ];

    public static function segunda()
    {
        return new DiaDaSemana(1);
    }

    public static function terca()
    {
        return new DiaDaSemana(2);
    }

    public static function quarta()
    {
        return new DiaDaSemana(3);
    }

    public static function quinta()
    {
        return new DiaDaSemana(4);
    }

    public static function sexta()
    {
        return new DiaDaSemana(5);
    }

    public static function sabado()
    {
        return new DiaDaSemana(6);
    }

    public static function domingo()
    {
        return new DiaDaSemana(7);
    }

    public static function fromInteger($diaDaSemana)
    {
        if ($diaDaSemana < 1 || $diaDaSemana > 7) {
            throw new \InvalidArgumentException("O dia da semana deve estar entre 1 e 7");
        }
        return new DiaDaSemana($diaDaSemana);
    }

    public static function fromDateTime(\DateTime $dateTime)
    {
        return new DiaDaSemana((int)$dateTime->format('N'));
    }

    /**
     * Representação do dia da semana de acordo com a ISO
     * https://en.wikipedia.org/wiki/ISO_week_date
     *
     * Onde 1 é segunda e 7 é domingo
     *
     * @var integer
     */
    private $diaDaSemana;

    private function __construct($diaDaSemana)
    {
        $this->diaDaSemana = $diaDaSemana;
    }

    public function igual(DiaDaSemana $diaDaSemana)
    {
        return $this->diaDaSemana === $diaDaSemana->diaDaSemana;
    }

    public function getNomeCompleto()
    {
        return self::__COMPLETO__[$this->diaDaSemana];
    }

    public function getNomeCurto()
    {
        return self::__CURTO__[$this->diaDaSemana];
    }

    public function getNomeAbreviado()
    {
        return self::__ABREVIADO__[$this->diaDaSemana];
    }
}