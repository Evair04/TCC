<?php

namespace Api;

return array(
    'service_manager' => array(
        'factories' => array(
            'Api\Authentication\Adapter\HeaderAuthentication' => 'Api\Factory\AuthenticationAdapterFactory',
            'Api\Listener\ApiAuthenticationListener' => 'Api\Factory\AuthenticationListenerFactory',
            'translator' => 'Zend\I18n\Translator\TranslatorServiceFactory',
        ),
    ),
    'doctrine' => array(
        'driver' => array(
            'Api_driver' => array(
                'class' => 'Doctrine\ORM\Mapping\Driver\AnnotationDriver',
                'cache' => 'array',
                'paths' => array(__DIR__ . '/../src/Api/Model')
            ),
            'orm_default' => array(
                'drivers' => array(
                    'Api\Model' => 'Api_driver'
                ),
            ),
            'orm_pesquisa' => array(
                'drivers' => array(
                    'Api\Model' => 'Api_driver'
                ),
            ),
        ),
        'eventmanager' => array(
            // 'orm_default' => array(
            //     'subscribers' => array(
            //         'Jsor\Doctrine\PostGIS\Event\ORMSchemaEventSubscriber'
            //     ),
            // ),
        ),
        'factories' => array(
            'translator' => 'Zend\Mvc\Service\TranslatorServiceFactory',
        ),
    ),
);

