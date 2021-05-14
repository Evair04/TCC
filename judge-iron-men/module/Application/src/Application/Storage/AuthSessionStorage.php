<?php
namespace Application\Storage;

use Zend\Authentication\Storage\Session;
use Zend\Session\Container;

class AuthSessionStorage extends Session
{

    const SESSION_CONTAINER_NAME = 'Session';
    const SESSION_VARIABLE_NAME = 'expirationTime';
    const IDLE_VARIABLE_NAME = 'idleLimitTime';

    public function setAuthenticationExpirationTime($allowedIdleTimeInSeconds = null){
        if($allowedIdleTimeInSeconds){
            $this->offsetSet(self::IDLE_VARIABLE_NAME, $allowedIdleTimeInSeconds * 60);
        }else if(!$this->offsetExists(self::IDLE_VARIABLE_NAME)){
            $this->offsetSet(self::IDLE_VARIABLE_NAME, 300);
        }

        $expirationTime = time() + $this->offsetGet(self::IDLE_VARIABLE_NAME);

        $this->offsetSet(self::SESSION_VARIABLE_NAME, $expirationTime);
    }

    public function getWhenSessionExpire(){
        return date('d/m/Y h:i:s', $this->offsetGet(self::SESSION_VARIABLE_NAME));
    }

    public function isExpiredAuthenticationTime(){

        if ($this->offsetExists(self::SESSION_VARIABLE_NAME)){
            $expirationTime = $this->offsetGet(self::SESSION_VARIABLE_NAME);
            return $expirationTime < time();
        }
        return false;
    }

    public function clearAuthenticationExpirationTime(){
        $this->offsetUnset(self::SESSION_VARIABLE_NAME);

    }

    public function offsetSet($label, $value){
        $container = new Container(self::SESSION_CONTAINER_NAME);
        $container->offsetSet($label, $value);

    }

    public function offsetGet($label){
        $container = new Container(self::SESSION_CONTAINER_NAME);
        return $container->offsetGet($label);

    }

    public function offsetExists($label){
        $container = new Container(self::SESSION_CONTAINER_NAME);
        return $container->offsetExists($label);

    }

    public function offsetUnset($label){
        $container = new Container(self::SESSION_CONTAINER_NAME);
        $container->offsetUnset($label);

    }

}