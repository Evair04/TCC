<?php

namespace WebService;

use Zend\Log\Logger;
use Zend\Log\Writer\Stream;
use Zend\Mvc\ModuleRouteListener;
use Zend\Mvc\MvcEvent;
use Zend\View\Model\JsonModel;
use Prestor\Util\Util;
use Zend\ModuleManager\Feature\ConfigProviderInterface;
use Zend\ModuleManager\Feature\AutoloaderProviderInterface;

class Module implements ConfigProviderInterface, AutoloaderProviderInterface {

    public function onBootstrap(MvcEvent $e) {
        $eventManager = $e->getApplication()->getEventManager();
        $moduleRouteListener = new ModuleRouteListener();
        $moduleRouteListener->attach($eventManager);
        $container = $e->getApplication()->getServiceManager();

        $eventManager->attach(MvcEvent::EVENT_DISPATCH_ERROR, array($this, 'onDispatchError'), 0);
        $eventManager->attach(MvcEvent::EVENT_RENDER_ERROR, array($this, 'onRenderError'), 0);
//
        $container->get('WebService\Listener\ValidationListener')->attach($eventManager);
        $container->get('WebService\Listener\AuthenticationListener')->attach($eventManager);
        $container->get('WebService\Listener\AuthorizationListener')->attach($eventManager);
        $container->get('WebService\Listener\CorsListener')->attach($eventManager);

        $app = $e->getApplication();
        $sm  = $app->getServiceManager();
        $em  = $app->getEventManager();
        $em->getSharedManager()->attach('Api\Controller', 'dispatch', [$this, 'onAuthenticate'], 80);

        $eventManager->attach(MvcEvent::EVENT_FINISH, function($e) {
            $hora = date('Y-m-d_H:i:s');
            $ano = date('Y');
            $mes = date('m');
            $dia = date('d');

            if (!$e->getRouteMatch()) {
                return;
            }

            $caminho = $e->getRouteMatch()->getMatchedRouteName();
            $metodo = $e->getRequest()->getMethod();
            $params = json_encode($e->getRequest()->getQuery());
            if ($metodo != 'GET' && $metodo != 'OPTIONS') {
                $dadosenviados = $e->getRequest()->getContent();
                $dadosretorno = $e->getResponse()->getContent();
                $dadosres = json_decode($dadosretorno);
                $sts = 'SUCCESS';
                if (is_array($dadosres->error)) {
                    if (count($dadosres->error) > 0) {
                        $sts = 'ERROR';
                    }
                }

                if (!is_dir('/var/log/trafegusrest/' . $ano . '/' . $mes . '/' . $dia)) {
                    mkdir('/var/log/trafegusrest/' . $ano . '/' . $mes . '/' . $dia, 0777, true);
                }
                $errorLogger = new Logger();
                $writer = new Stream('/var/log/trafegusrest/' . $ano . '/' . $mes . '/' . $dia . '/' . $hora . '_' . $metodo . '_' . str_replace('/','_',$caminho ) . '_' . $sts . '.txt');
                $errorLogger->addWriter($writer);

                $errorLogger->err("\n***DADOS RECEBIDOS: \n\n" . $dadosenviados . "\n\n***RETORNO GERADO: \n\n" . $dadosretorno . "\n\n***PARAMETROS: \n\n" . $params);
            }
        }, 0);
    }

    public function onAuthenticate($e) {
// Verifica se tem usuário logado
        $usuario = $e->getParam('user');
//          $usuario     = $usuario->getLogin();
//        print_r($usuario ? $usuario->getLogin() : 'Em branco');
//        exit;

        if (!$usuario) {
            return;
        }

// Busca a conexão do entityManager
        $serviceManager = $e->getApplication()
                ->getServiceManager();

        $connection = $serviceManager
                ->get('doctrine.entitymanager.orm_default')
                ->getConnection();

// Previsa fechar a conexão para alterar o usuário
        $connection->close();

// Altera a propriedade _params da conexão para public
        $reflection = new \ReflectionObject($connection);
        $attribute = $reflection->getProperty('_params');
        $attribute->setAccessible('public');

// Copia os parâmetros da conexão para uma variável local
// e altera o usuário
        $params = $attribute->getValue($connection);

        $login = $usuario->getLogin();

        $params['user'] = strtolower($login);


// Altera o valor da propriedade
        $attribute->setValue($connection, $params);

// Volta a propriedade params para private
        $attribute->setAccessible('private');

// Na próxima vez que algum código usar o entityManager ou a conexão
// ele vai abrir com o usuário que foi setado aqui
    }

    public function onDispatchError($e) {
        return $this->getJsonModelError($e);
    }

    public function onRenderError($e) {
        return $this->getJsonModelError($e);
    }

    public function getJsonModelError($e) {
        $error = $e->getError();
        if (!$error) {
            return;
        }

        $response = $e->getResponse();
        $exception = $e->getParam('exception');
        $exceptionJson = array();

        $currentException = $exception;
        while ($currentException) {
            $exceptionJson[] = array(
                'class' => get_class($currentException),
                'file' => $currentException->getFile(),
                'line' => $currentException->getLine(),
                'message' => $currentException->getMessage(),
                'stacktrace' => $currentException->getTrace()
            );

            $currentException = $currentException->getPrevious();
        }
//ultra thin u25
        $errorJson = array(
            'message' => 'An error occurred during execution; please try again later.',
            'error' => $error,
            'exception' => $exceptionJson,
        );

        if ($error == 'error-router-no-match') {
            $errorJson['message'] = 'Resource not found.';
        }

        $model = new JsonModel(array('errors' => array($errorJson)));
        $e->setResult($model);

        return $model;
    }

    public function getAutoloaderConfig() {
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

    public function getConfig() {
        return include __DIR__ . '/config/module.config.php';
    }

    public function getServiceConfig() {
        return array(
            'factories' => array(
                'doctrine.connection.orm_default' => new \DoctrineORMModule\Service\DBALConnectionFactory('orm_default'),
                'doctrine.configuration.orm_default' => new \DoctrineORMModule\Service\ConfigurationFactory('orm_default'),
                'doctrine.entitymanager.orm_default' => new \DoctrineORMModule\Service\EntityManagerFactory('orm_default'),
                'doctrine.driver.orm_default' => new \DoctrineModule\Service\DriverFactory('orm_default'),
                'doctrine.eventmanager.orm_default' => new \DoctrineModule\Service\EventManagerFactory('orm_default'),
                'doctrine.connection.orm_pesquisa' => new \DoctrineORMModule\Service\DBALConnectionFactory('orm_pesquisa'),
                'doctrine.configuration.orm_pesquisa' => new \DoctrineORMModule\Service\ConfigurationFactory('orm_pesquisa'),
                'doctrine.entitymanager.orm_pesquisa' => new \DoctrineORMModule\Service\EntityManagerFactory('orm_pesquisa'),
                'doctrine.driver.orm_pesquisa' => new \DoctrineModule\Service\DriverFactory('orm_pesquisa'),
                'doctrine.eventmanager.orm_pesquisa' => new \DoctrineModule\Service\EventManagerFactory('orm_pesquisa'),
        ));
    }

}
