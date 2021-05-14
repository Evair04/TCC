<?php
/**
 * This makes our life easier when dealing with paths. Everything is relative
 * to the application root now.
 */
chdir(dirname(__DIR__));
//error_reporting(E_ALL & ~E_USER_DEPRECATED);

error_reporting(E_ALL & ~E_USER_DEPRECATED & ~E_WARNING & ~E_NOTICE);
define('PUBLIC_URL', 'http://localhost/ws_rest/public/');
define('PUBLIC_RAIZ', realpath(__DIR__));

// Decline static file requests back to the PHP built-in webserver
if (php_sapi_name() === 'cli-server') {
    $path = realpath(__DIR__ . parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));
    if (__FILE__ !== $path && is_file($path)) {
        return false;
    }
    unset($path);
}

// Setup autoloading
require 'init_autoloader.php';

// Run the application!
$app = Zend\Mvc\Application::init(require 'config/application.config.php');


$app->run();
