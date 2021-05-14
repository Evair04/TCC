<?php
return array(
    'doctrine' => array(
        'connection' => array(
            'orm_default' => array(
                'driverClass' => 'Doctrine\DBAL\Driver\PDOPgSql\Driver',
                    'params' => array(
                        'host' => '144.22.108.228',
                        'port' => '5432',
                        'dbname' => 'judge',
                        'user' => 'postgres',
                        'password' => 'chp@postgresT!0479',
                ),
            ),
        ),
        'entitymanager' => array(
            'orm_default' => array(
                'connection' => 'orm_default',
                'configuration' => 'orm_default'
            ),
        ),
        'configuration' => array(
            'orm_default' => array(
                'proxy_dir' => 'data/DoctrineORMModule/Proxy',
                'proxy_namespace' => 'DoctrineORMModule\Proxy',
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
