<?php
namespace Api\Factory;

use Api\Authentication\Adapter\HeaderAuthentication;

use Doctrine\ORM\EntityManager;
use Zend\EventManager\EventManager;
use Zend\EventManager\EventManagerInterface;
use Zend\ServiceManager\FactoryInterface;
use Zend\ServiceManager\ServiceLocatorInterface;

class AuthenticationAdapterFactory implements FactoryInterface
{
    public function createService(ServiceLocatorInterface $sl)
    {
        return new HeaderAuthentication(
            $sl->get(EntityManager::class),
            $sl->get('Request'),
            $sl->get(EventManagerInterface::class)
        );
    }
}
