<?php
namespace Api;

 use Zend\ModuleManager\Feature\AutoloaderProviderInterface;
 use Zend\ModuleManager\Feature\ConfigProviderInterface;

 use Zend\Mvc\MvcEvent;
 use Zend\Validator\AbstractValidator;
 use Zend\Mvc\I18n\Translator;

// use Jsor\Doctrine\PostGIS\Event\ORMSchemaEventSubscriber;

 class Module implements AutoloaderProviderInterface, ConfigProviderInterface
 {

    public function onBootstrap(MvcEvent $event)
    {
        $app = $event->getApplication();
        $sm  = $app->getServiceManager();
        $em  = $app->getEventManager();
        
        $entityManager = $sm->get('doctrine.entitymanager.orm_default');
//        $entityManager->getEventManager()->addEventSubscriber(new ORMSchemaEventSubscriber());
        
//        $entityManagerPesquisa = $sm->get('doctrine.entitymanager.orm_pesquisa');
//        $entityManagerPesquisa->getEventManager()->addEventSubscriber(new ORMSchemaEventSubscriber());        
        
        $listener = $sm->get('Api\Listener\ApiAuthenticationListener');
        $em->getSharedManager()->attach('Api\Controller', MvcEvent::EVENT_DISPATCH, $listener, 100);

        $translator = $sm->get('translator');
        $translator->addTranslationFile('phpArray', './vendor/zendframework/zend-i18n-resources/languages/pt_BR/Zend_Validate.php');
        AbstractValidator::setDefaultTranslator(new Translator($translator));

    }

     public function getAutoloaderConfig()
     {
         return array(
             'Zend\Loader\ClassMapAutoloader' => array(
                 __DIR__ . '/autoload_classmap.php',
             ),
             'Zend\Loader\StandardAutoloader' => array(
                 'namespaces' => array(
                     __NAMESPACE__ => __DIR__ . '/src/' . __NAMESPACE__,
                 ),
             ),
         );
     }

     public function getConfig()
     {
         return include __DIR__ . '/config/module.config.php';
     }

     public function getServiceConfig()
     {
         return array(
             'factories' => array(
                'Zend\Authentication\AuthenticationService' => function($serviceManager) {
                    // If you are using DoctrineORMModule:
                    return $serviceManager->get('doctrine.authenticationservice.orm_default');
                }
             ),
         );
     }
 }
