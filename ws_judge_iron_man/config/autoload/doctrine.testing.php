<?php

return array(
    'doctrine' => array(
        'connection' => array(
            'orm_default' => array(
                'driverClass' => 'Doctrine\DBAL\Driver\PDOPgSql\Driver',
                'params' => array(
                    'host' => 'db',
                    'port' => '5432',
                    'dbname' => 'trafegus_teste',
                    'user' => 'postgres',
                    'password' => '12345',
                ),
            ),
        ),
        'Fixture' => array(
            'GerenciamentoRisco' => __DIR__ . '/../module/GerenciamentoRisco/test/GerenciamentoRiscoTest/Fixture',
        )
    ),
);
?>
