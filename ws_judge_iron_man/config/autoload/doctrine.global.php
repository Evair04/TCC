<?php

return array(
    'doctrine' => array(
        'connection' => array(
            'orm_default' => array(
                'driverClass' => 'Doctrine\DBAL\Driver\PDOPgSql\Driver',
                    'params' => array(
                        'host' => '144.22.108.228', // '144.22.108.228',
                        'port' => '5432',
                        'dbname' => 'trafegus_pg10_pct44',
                        'user' => 'trafegusweb',
                        'password' => 'chp@0479',
                ),
            ),
        ),
        'entitymanager' => array(
            'orm_default' => array(
                'connection' => 'orm_default',
                'configuration' => 'orm_default'
            ),
        ),
        'authentication' => array(
            'orm_default' => array(
                'object_manager' => 'Doctrine\ORM\EntityManager',
                'identity_class' => 'Api\Model\Usuario',
                'identity_property' => 'email',
                'credential_property' => 'senha',
            ),
        ),
    ),
);
