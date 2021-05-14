<?php
/**
 * Created by PhpStorm.
 * User: angelo
 * Date: 25/02/19
 * Time: 16:54
 */

namespace Application\Service\Factory;


use \Zend\ServiceManager\FactoryInterface;
use \Zend\ServiceManager\ServiceLocatorInterface;

class GatewayManagerFactory implements FactoryInterface
{
    /**
     * Create service
     *
     * @param ServiceLocatorInterface $serviceLocator
     * @return mixed
     */
    public function createService(ServiceLocatorInterface $serviceLocator)
    {

        $config = $serviceLocator->get('config')['doctrine']['connection']['orm_gateway'];
        $em = $serviceLocator->get('doctrine.entitymanager.orm_default');
        $connection = array(
            'driverClass' => $config['driverClass'],
            'host' => $config['params']['host'],
            'port' => $config['params']['port'],
            'dbname' => $config['params']['dbname'],
            'user' => $config['params']['user'],
            'password' => $config['params']['password']
        );

        return $em->create($connection, $em->getConfiguration());
    }

}