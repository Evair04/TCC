<?php

namespace WebService;

return array(
    'controllers' => array(
        'invokables' => array(
            'WebService\Controller\Competicao' => 'WebService\Controller\CompeticaoController',
            'WebService\Controller\Usuario' => 'WebService\Controller\UsuarioController',
        ),
    ),
    'router' => array(
        'routes' => array(

            'usuario' => array(
                'type' => 'segment',
                'options' => array(
                    'route' => '/api/usuario[/:id]',
                    'constraints' => array(
                        'id' => '[0-9]+',
                    ),
                    'defaults' => array(
                        'controller' => 'WebService\Controller\Usuario',
                    ),
                ),
            ),
            'competicao' => array(
                'type' => 'segment',
                'options' => array(
                    'route' => '/api/competicao[/:id]',
                    'constraints' => array(
                        'id' => '[0-9]+',
                    ),
                    'defaults' => array(
                        'controller' => 'WebService\Controller\Competicao',
                    ),
                ),
            ),

        ),
    ),
    'service_manager' => array(
        'factories' => array(
            'WebService\Listener\ValidationListener' => 'WebService\Listener\Factory\ValidationListenerFactory',
            'WebService\Listener\AuthenticationListener' => 'WebService\Listener\Factory\AuthenticationListenerFactory',
            'WebService\Listener\AuthorizationListener' => 'WebService\Listener\Factory\AuthorizationListenerFactory',
            'WebService\Listener\CorsListener' => 'WebService\Listener\Factory\CorsListenerFactory',

        ),
    ),
    'view_manager' => array('display_exceptions' => false,
        'strategies' => array(
            'ViewJsonStrategy',
        ),
    ),
);
