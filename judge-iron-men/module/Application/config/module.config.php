<?php

namespace Application;

use Application\Form\Factory\PerfilMonitorPlanejamentoCargaFormFactory;
use Application\Form\PerfilMonitorPlanejamentoCargaForm;

return array(

    'doctrine' => array(
        'driver' => array(
            'Api_driver' => array(
                'class' => 'Doctrine\ORM\Mapping\Driver\AnnotationDriver',
                'cache' => 'array',
                'paths' => array(__DIR__ . '/../src/Application/Model')
            ),
            'orm_default' => array(
                'drivers' => array(
                    'Application\Model' =>  'Api_driver'
                ),
            ),
        ),
        'authentication' => array(
            'orm_default' => array(
                'object_manager' => 'Doctrine\ORM\EntityManager',
                'identity_class' =>  'Application\Model\Usuario',
                'identity_property' => 'login',
                'credential_property' => 'senha',
            ),
        ),
        'configuration' => array(
            'orm_default' => array(
                'proxy_dir' => 'data/DoctrineORMModule/Proxy',
                'proxy_namespace' => 'DoctrineORMModule\Proxy',
            ),
        ),
        'eventmanager' => array(
            'orm_default' => array(
                'subscribers' => array(
                    'Jsor\Doctrine\PostGIS\Event\ORMSchemaEventSubscriber'
                ),
            ),
        ),
    ),

    'controllers' => array(
        'invokables' => array(
            'Application\Controller\Index' => 'Application\Controller\IndexController',
            'Application\Controller\ResumoFrota' => 'Application\Controller\ResumofrotaController',
        ),
    ),

    'router' => array(
        'routes' => array(
            'home' => array(
                'type' => 'Zend\Mvc\Router\Http\Literal',
                'options' => array(
                    'route'    => '/',
                    'defaults' => array(
                        'controller' => 'Application\Controller\Index',
                        'action'     => 'index',
                    ),
                ),
            ),
            'index' => array(
                'type'    => 'segment',
                'options' => array(
                    'route'    => '/index[/:action]',
                    'constraints' => array(
                        'action' => '[a-zA-Z][a-zA-Z0-9_-]*',
                    ),
                    'defaults' => array(
                        'controller' => 'Application\Controller\Index',
                        'action'     => 'index',
                    ),
                ),
            ),
            'resumofrota' => array(
                'type'    => 'segment',
                'options' => array(
                    'route'    => '/resumofrota[/:action]',
                    'constraints' => array(
                        'action' => '[a-zA-Z][a-zA-Z0-9_-]*',
                    ),
                    'defaults' => array(
                        'controller' => 'Application\Controller\ResumoFrota',
                        'action'     => 'index',
                    ),
                ),
            ),
        ),
     ),
    'input_filters' => array(
        'abstract_factories' => array(
            'Zend\InputFilter\InputFilterAbstractServiceFactory'
        ),
    ),


    'validators' => array(
        'factories' => array(
            'UniqueObject' => 'Application\Validator\Factory\UniqueObjectFactory',
            'ObjectExists' => 'Application\Validator\Factory\ObjectExistsFactory',
        )
    ),
    'service_manager' => array(
        'abstract_factories' => array(
            'Zend\Cache\Service\StorageCacheAbstractServiceFactory',
            'Zend\Log\LoggerAbstractServiceFactory',
        ),
        'factories' => array(
            'role_entitymanager' => 'Application\Service\Factory\EntityManagerFactory',
            'dw_entitymanager' => 'Application\Service\Factory\DwManagerFactory',
            'gateway_entitymanager' => 'Application\Service\Factory\GatewayManagerFactory',
            'hot_standby_entitymanager' => 'Application\Service\Factory\HotStandByFactory',
            'pesquisa_entitymanager' => 'Application\Service\Factory\PesquisaFactory',
            'translator' => 'Zend\Mvc\Service\TranslatorServiceFactory',
        ),
        'invokables' => array(

            'Application\Service\ResumoFrotaService' => 'Application\Service\ResumoFrotaService',
        )
    ),



    'view_helpers' => array(
        'invokables'=> array(
            'GeraHtmlFormPessoaView' => 'Application\View\Helper\GeraHtmlFormPessoaView',
            'MenuView' => 'Application\View\Helper\MenuView',
            'MenuViewClassico' => 'Application\View\Helper\MenuViewClassico',
            'RenderView' => 'Application\View\Helper\RenderView',
            'RenderStepView' => 'Application\View\Helper\RenderStepView',
        )
    ),
    'view_manager' => array(
        'display_not_found_reason' => true,
        'display_exceptions'       => true,
        'doctype'                  => 'HTML5',
        'not_found_template'       => 'error/404',
        'exception_template'       => 'error/index',
        'template_map' => array(
            'layout/layout'           => __DIR__ . '/../view/layout/layout.phtml',
            'layout/default'           => __DIR__ . '/../view/layout/layout.phtml',
            'layout/login'           => __DIR__ . '/../view/layout/login.phtml',
            'layout/monitor'           => __DIR__ . '/../view/layout/monitor.phtml',
            'layout/monitorlogistico'   => __DIR__ . '/../view/layout/monitorlogistico.phtml',
            'error/404'               => __DIR__ . '/../view/error/404.phtml',
            'error/index'             => __DIR__ . '/../view/error/index.phtml',
        ),
        'template_path_stack' => array(
            __DIR__ . '/../view',
        ),
        'strategies' => array(
            'ViewJsonStrategy',
        ),
    ),

    // Placeholder for console routes
    'console' => array(
        'router' => array(
            'routes' => array(
            ),
        ),
    ),
);
