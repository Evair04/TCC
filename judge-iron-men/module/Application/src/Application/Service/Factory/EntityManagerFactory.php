<?php

namespace Application\Service\Factory;

use \Zend\ServiceManager\FactoryInterface;
use \Zend\ServiceManager\ServiceLocatorInterface;

class EntityManagerFactory implements FactoryInterface
{

    /**
     * Create service
     *
     * @param ServiceLocatorInterface $serviceLocator
     * @return mixed
     */
    public function createService(ServiceLocatorInterface $serviceLocator)
    {

        $session = $serviceLocator->get('Session');
        $config = $serviceLocator->get('config')['doctrine']['connection']['orm_default'];
        $em = $serviceLocator->get('doctrine.entitymanager.orm_default');

        $login = strtolower($session->offsetGet('user')->getLogin());

        if (preg_match('/\d{9}-\d{2}/', $login)) {
            $login = 'prestor' . str_replace('-', '_', $login);
        }

        $login = str_replace("@", "", $login);
        $login = str_replace(".", "", $login);
        $login = str_replace("-", "", $login);

        $connection = array(
            'driverClass' => $config['driverClass'],
            'host' => $config['params']['host'],
            'port' => $config['params']['port'],
            'dbname' => $config['params']['dbname'],
            'user' => $login,
            'password' => $config['params']['password']
        );

        return $em->create($connection, $em->getConfiguration());
    }
}