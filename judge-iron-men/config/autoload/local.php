<?php
/*
{************************************************************************}
{                                                                        }
{       CHP Soluções em Tecnologia                                       }
{       Produto da Familia Trafegus                                      }
{                                                                        }
{       Copyright (c) 2011-2018                                          }
{       TODOS OS DIREITOS RESERVADOS                                     }
{                                                                        }
{   Todos os conteúdos deste arquivo é protegido                         }
{   por leis internacionasis de registro e patente.                      }
{   A reprodução não autorizada, engenharia reversa ou distribuição      }
{   de todos ou parte do codigo contidos neste arquivo são               }
{   estritamente proibidas e podem resultar em severas penalidades       }
{   civis e criminais, processados na máxima extensão possível ao        }
{   abrigo da lei.                                                       }
{                                                                        }
{   RESTRIÇÕES                                                           }
{                                                                        }
{   ESTE CÓDIGO FONTE E TODOS OS ARQUIVOS RESULTANTES (PHP, CSS, JS, ETC)}
{   SÃO CONFIDENCIAIS E PROPRIETÁRIAS, COM DIREITOS COMERCIAIS           }
{   EXCLUSIVO DA CHP SOLUÇÕES LTDA EPP.                                  }
{   O CÓDIGO-FONTE CONTIDO DENTRO DESTE ARQUIVO OU QUALQUER PARTE DO     }
{   SEU CONTEÚDO, NÃO PODE SER COPIADO, TRASFERIDO, VENDIDO OU           }
{   DISTRIBUÍDO DE OUTRA FORMA PARA OUTRAS PESSOAS SEM CONSENTIMENTO     }
{   EXPRESSO POR ESCRITO SEDIDO PELA CHP SOLUÇÕES LTDA EPP.              }
{   PARA MAIS INFORMAÇÕES CONSULTAR O CONTRATO DE LICENÇA DE USO E       }
{   SUAS RESTRIÇOES ADICIONAIS.                                          }
*/

return array(
    'service_manager' => array(
        'factories' => array(
            'Zend\Db\Adapter\Adapter'
            => 'Zend\Db\Adapter\AdapterServiceFactory',
        ),
    ),

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
            'orm_hot_standby' => array(
                'driverClass' => 'Doctrine\DBAL\Driver\PDOPgSql\Driver',
                'params' => array(
                    'host' => '144.22.108.228',
                    'port' => '5432',
                    'dbname' => 'trafegus_pg10_pct45',
                    'user' => 'trafegusweb',
                    'password' => 'chp@0479',
                ),
            ),
            'orm_pesquisa' => array(
                'driverClass' => 'Doctrine\DBAL\Driver\PDOPgSql\Driver',
                'params' => array(
                    'host' => '186.250.92.150',
                    'port' => '5435',
                    'dbname' => 'trafeguscad42',
                    'user' => 'administrador',
                    'password' => 'chp@0479',
                ),
            ),
            'orm_dw' => array(
                'driverClass' => 'Doctrine\DBAL\Driver\PDOPgSql\Driver',
                'params' => array(
                    'host' => '186.250.92.150',
                    'port' => '5435',
                    'dbname' => 'dw_41',
                    'user' => 'administrador',
                    'password' => 'chp@0479',
                ),
            ),
            'orm_gateway' => array(
                'driverClass' => 'Doctrine\DBAL\Driver\PDOPgSql\Driver',
                'params' => array(
                    'host' => '186.250.92.150',
                    'port' => '5435',
                    'dbname' => 'trafegusgateway40',
                    'user' => 'trafegusweb',
                    'password' => 'chp@0479',
                ),
            )
        ),
        'entitymanager' => array(
            'orm_default' => array(
                'connection'    => 'orm_default',
                'configuration' => 'orm_default'
            ),
            'orm_hot_standby' => array(
                'connection'    => 'orm_hot_standby',
                'configuration' => 'orm_hot_standby'
            ),
            'orm_dw' => array(
                'connection'    => 'orm_dw',
                'configuration' => 'orm_dw'
            ),
            'orm_pesquisa' => array(
                'connection'    => 'orm_pesquisa',
                'configuration' => 'orm_pesquisa'
            ),
            'orm_gateway' => array(
                'connection'    => 'orm_gateway',
                'configuration' => 'orm_gateway'
            )
        ),
        'configuration' => array(
            'orm_default' => array(
                'datetime_functions' => array(
                    'TO_CHAR' => 'DoctrineExtensions\Query\Postgresql\DateFormat'
                ),
                'string_functions'   => array(
                    'ST_X' => 'Jsor\Doctrine\PostGIS\Functions\ST_X',
                    'ST_Y' => 'Jsor\Doctrine\PostGIS\Functions\ST_Y',
                    'CAST' => 'Oro\ORM\Query\AST\Functions\Cast',
                    'FIRST: AppBundle\DBAL\FirstFunction',
                    'REPLACE'=> 'DoctrineExtensions\Query\Postgresql\StrReplace'
                ),
                'numeric_functions' => array(
                    'TO_NUMBER' => 'DoctrineExtensions\Query\Postgresql\NumberFormat'
                ),
                // 'metadata_cache'     => 'filesystem',
                // 'query_cache'        => 'filesystem',
                // 'result_cache'       => 'filesystem',
            ),
            'orm_hot_standby' => array(
                'metadata_cache'    => 'array',
                'query_cache'       => 'array',
                'result_cache'      => 'array',
                'driver'            => 'orm_hot_standby', // This driver will be defined later
                'generate_proxies'  => true,
                'proxy_dir'         => 'data/DoctrineORMModule/Proxy',
                'proxy_namespace'   => 'DoctrineORMModule\Proxy',
                'filters'           => array(),
                'datetime_functions' => array(
                    'TO_CHAR' => 'DoctrineExtensions\Query\Postgresql\DateFormat'
                ),
                'string_functions'   => array(
                    'ST_X' => 'Jsor\Doctrine\PostGIS\Functions\ST_X',
                    'ST_Y' => 'Jsor\Doctrine\PostGIS\Functions\ST_Y',
                    'CAST' => 'Oro\ORM\Query\AST\Functions\Cast',
                    'FIRST: AppBundle\DBAL\FirstFunction',
                    'REPLACE'=> 'DoctrineExtensions\Query\Postgresql\StrReplace'
                ),
                'numeric_functions' => array(
                    'TO_NUMBER' => 'DoctrineExtensions\Query\Postgresql\NumberFormat'
                ),
            ),
            'orm_pesquisa' => array(
                'metadata_cache'    => 'array',
                'query_cache'       => 'array',
                'result_cache'      => 'array',
                'driver'            => 'orm_pesquisa', // This driver will be defined later
                'generate_proxies'  => true,
                'proxy_dir'         => 'data/DoctrineORMModule/Proxy',
                'proxy_namespace'   => 'DoctrineORMModule\Proxy',
                'filters'           => array(),
                'datetime_functions' => array(
                    'TO_CHAR' => 'DoctrineExtensions\Query\Postgresql\DateFormat'
                ),
                'string_functions'   => array(
                    'ST_X' => 'Jsor\Doctrine\PostGIS\Functions\ST_X',
                    'ST_Y' => 'Jsor\Doctrine\PostGIS\Functions\ST_Y',
                    'CAST' => 'Oro\ORM\Query\AST\Functions\Cast',
                    'FIRST: AppBundle\DBAL\FirstFunction',
                    'REPLACE'=> 'DoctrineExtensions\Query\Postgresql\StrReplace'
                ),
                'numeric_functions' => array(
                    'TO_NUMBER' => 'DoctrineExtensions\Query\Postgresql\NumberFormat'
                ),
            ),
            'orm_gateway' => array(
                'metadata_cache'    => 'array',
                'query_cache'       => 'array',
                'result_cache'      => 'array',
                'driver'            => 'orm_gateway', // This driver will be defined later
                'generate_proxies'  => true,
                'proxy_dir'         => 'data/DoctrineORMModule/Proxy',
                'proxy_namespace'   => 'DoctrineORMModule\Proxy',
                'filters'           => array(),
                'datetime_functions' => array(
                    'TO_CHAR' => 'DoctrineExtensions\Query\Postgresql\DateFormat'
                ),
                'string_functions'   => array(
                    'ST_X' => 'Jsor\Doctrine\PostGIS\Functions\ST_X',
                    'ST_Y' => 'Jsor\Doctrine\PostGIS\Functions\ST_Y',
                    'CAST' => 'Oro\ORM\Query\AST\Functions\Cast',
                    'FIRST: AppBundle\DBAL\FirstFunction',
                    'REPLACE'=> 'DoctrineExtensions\Query\Postgresql\StrReplace'
                ),
                'numeric_functions' => array(
                    'TO_NUMBER' => 'DoctrineExtensions\Query\Postgresql\NumberFormat'
                ),
            ),
            'orm_dw' => array(
                'metadata_cache'    => 'array',
                'query_cache'       => 'array',
                'result_cache'      => 'array',
                'driver'            => 'orm_dw', // This driver will be defined later
                'generate_proxies'  => true,
                'proxy_dir'         => 'data/DoctrineORMModule/Proxy',
                'proxy_namespace'   => 'DoctrineORMModule\Proxy',
                'filters'           => array(),
                'datetime_functions' => array(
                    'TO_CHAR' => 'DoctrineExtensions\Query\Postgresql\DateFormat'
                ),
                'string_functions'   => array(
                    'ST_X' => 'Jsor\Doctrine\PostGIS\Functions\ST_X',
                    'ST_Y' => 'Jsor\Doctrine\PostGIS\Functions\ST_Y',
                    'CAST' => 'Oro\ORM\Query\AST\Functions\Cast',
                    'FIRST: AppBundle\DBAL\FirstFunction',
                    'REPLACE'=> 'DoctrineExtensions\Query\Postgresql\StrReplace'
                ),
                'numeric_functions' => array(
                    'TO_NUMBER' => 'DoctrineExtensions\Query\Postgresql\NumberFormat'
                )
            )
        )
    ),
    'session' => array(
        'config' => array(
            'class' => 'Zend\Session\Config\SessionConfig',
            'options' => array(
                'name' => 'Trafegus',
                'cookie_httponly' => true,
                'cookie_lifetime' => 3600,
                'gc_maxlifetime' => 3600,
                'remember_me_seconds' => 3600,
            ),
        ),
        'validators' => array(
            'Zend\Session\Validator\RemoteAddr',
            'Zend\Session\Validator\HttpUserAgent',
        ),
    ),
);
