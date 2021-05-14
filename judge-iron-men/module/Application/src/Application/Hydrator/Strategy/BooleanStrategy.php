<?php

namespace Application\Hydrator\Strategy;

use Zend\Hydrator\Strategy\StrategyInterface;

class BooleanStrategy implements StrategyInterface
{
    public function extract($value)
    {
        return $value === 'S';
    }

    public function hydrate($value)
    {
        return $value ? 'S' : 'N';
    }
}