<?php
namespace Base\Entity;
use Zend\Hydrator\ClassMethods;
use Zend\InputFilter\InputFilterAwareInterface;
use Zend\InputFilter\InputFilterInterface;


/**
 * Class AbstractEntity
 * @package Base\Entity
 */
abstract class AbstractEntity implements InputFilterAwareInterface
{
    /**
     * AbstractEntity constructor.
     * @param array $options
     */
    public function __construct(Array $options = array())
    {
        $hydrator = new ClassMethods();
        $hydrator->hydrate($options, $this);
    }

    /**
     * @return array
     */
    public function toArray()
    {
        $hydrator = new ClassMethods();
        return $hydrator->extract($this);
    }

    public function setInputFilter(InputFilterInterface $inputFilter)
    {
        throw new \Exception("Não implementado");
    }

    public function getInputFilter()
    {
        throw new \Exception("Não implementado");
    }


}
