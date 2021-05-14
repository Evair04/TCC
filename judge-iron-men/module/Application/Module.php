<?php

namespace Application;

use Doctrine\DBAL\Driver\PDOException;
use Zend\Log\Logger;
use Zend\Log\Writer\Stream;
use Zend\ModuleManager\Feature\AutoloaderProviderInterface;
use Zend\ModuleManager\Feature\ConfigProviderInterface;
use Application\Storage\AuthSessionStorage;
use Zend\Validator\AbstractValidator;
use Zend\Mvc\I18n\Translator;
use Zend\Mvc\MvcEvent;

class Module implements AutoloaderProviderInterface, ConfigProviderInterface {

    public function onBootstrap(MvcEvent $event) {

        $errorLogger = new Logger();
        $writer      = new Stream('/tmp/error.log');
        $errorLogger->addWriter($writer);

        $eventManager = $event->getApplication()->getEventManager();
        foreach (['dispatch.error', 'render.error'] as $row) {
            $eventManager->attach($row, function ($e) use($errorLogger, $event) {
                /** @var \Exception $exception */
                $exception = $e->getParam('exception');

                if (!$exception) {
                    return;
                }

                do {
                    error_log($exception);
                    $errorLogger->err($exception->getMessage() . "\n arquivo:" .  $exception->getFile() . "\n linha:". $exception->getLine());

                    if ($exception instanceof PDOException && $exception->getCode() == 7) {
                        $response = $e->getResponse();
                        $response->setStatusCode(402);

                        $e->getViewModel()->setTemplate('error/402');
                        return $response;
                    }

                    $exception = $exception->getPrevious();
                } while($exception != null);
            });
        }

        $app = $event->getApplication();
        $sm = $app->getServiceManager();
        $em = $app->getEventManager();

//        $em->attach(\Zend\Mvc\MvcEvent::EVENT_DISPATCH_ERROR, array($this, 'handleError'));

        $em->attach(\Zend\Mvc\MvcEvent::EVENT_ROUTE, array($this, 'carregarProxies'));

        $translator = $sm->get('translator');
        $translator->addTranslationFile('phpArray', './module/Base/language/'.LANGUAGE.'/Zend_Validate.php');
        AbstractValidator::setDefaultTranslator(new Translator($translator));


    }
//
    public function carregarProxies(){
        $dir = './data/DoctrineORMModule/Proxy/';
        $directory = opendir($dir);
        while (($file = readdir($directory)) !== false) {
            if(strlen($file) > 5){
                include $dir . $file;
            }
        }
    }

    public function getAutoloaderConfig() {
        return array(
            'Zend\Loader\StandardAutoloader' => array(
                'namespaces' => array(
                    __NAMESPACE__ => __DIR__ . '/src/' . __NAMESPACE__,
                ),
            ),
        );
    }

    public function getServiceConfig()
    {
        return array(
            'factories' => array(
                'Session' => function($sm) {
                    return new AuthSessionStorage();
                },
                'Zend\Authentication\AuthenticationService' => function($sm) {
                    $AuthService = $sm->get('doctrine.authenticationservice.orm_default');
                    $AuthService->setStorage($sm->get('Session'));
                    return $AuthService;
                },
            )
        );
    }


    public function getConfig() {
        return include __DIR__ . '/config/module.config.php';
    }
}