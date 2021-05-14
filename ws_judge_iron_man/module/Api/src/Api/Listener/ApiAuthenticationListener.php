<?php
namespace Api\Listener;

use Api\Authentication\Adapter\HeaderAuthentication;
use Zend\Mvc\MvcEvent;

class ApiAuthenticationListener
{
    protected $adapter;

    public function __construct(HeaderAuthentication $adapter)
    {
        $this->adapter = $adapter;
    }


    public function __invoke(MvcEvent $event)
    {
//        var_dump("set param");
//        exit;
        
        if (strpos($event->getRequest()->getRequestUri(), 'usuario') !== false &&
            $event->getRequest()->isPost()) {

            // All is OK
            $event->setParam('user', null);

        }else{
            //echo'deu boas';
            $result = $this->adapter->authenticate();


            if (!$result->isValid()) {
                $response = $event->getResponse();

                // Set some response content
                $response->setStatusCode(401);
                $response->setContent(json_encode(array(
                    'error' => $result->getMessages()
                )));
                return $response;
            }
            
            // All is OK
            $event->setParam('user', $result->getIdentity());
        }
    }
}