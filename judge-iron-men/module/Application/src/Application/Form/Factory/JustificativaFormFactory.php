<?php

namespace Application\Form\Factory;

use Application\Form\JustificativaForm;
use Zend\ServiceManager\FactoryInterface;
use Zend\ServiceManager\ServiceLocatorInterface;

class JustificativaFormFactory implements FactoryInterface
{
    /**
     * @param ServiceLocatorInterface $serviceLocator
     * @return mixed
     */
    public function createService(ServiceLocatorInterface $serviceLocator)
    {
        $entityManager = $serviceLocator->getServiceLocator()
            ->get('role_entitymanager');

        $inputFilter = $serviceLocator->getServiceLocator()
            ->get('InputFilterManager')
            ->get('justificativa');

        return new JustificativaForm($entityManager, $inputFilter);
    }
}