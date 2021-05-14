<?php
/**
 * Created by PhpStorm.
 * User: angelo
 * Date: 18/09/18
 * Time: 09:17
 */

namespace Application\Service\Factory;


use \Zend\ServiceManager\FactoryInterface;
use \Zend\ServiceManager\ServiceLocatorInterface;

class HotStandByFactory implements FactoryInterface
{
    /**
     * Create service
     *
     * @param ServiceLocatorInterface $serviceLocator
     * @return mixed
     */
    public function createService(ServiceLocatorInterface $serviceLocator)
    {
        $config = $serviceLocator->get('config')['doctrine']['connection']['orm_hot_standby'];
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