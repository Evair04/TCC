<?php
//ini_set('display_errors', 1);
chdir(dirname(__DIR__));

set_time_limit(330);
error_reporting(E_ALL & ~E_DEPRECATED & ~E_USER_DEPRECATED & ~E_NOTICE & ~E_WARNING);

ini_set('memory_limit', '512M');
define('PASTA', basename(getcwd()));
//define('URL_WEB_SERVICE', 'http://144.22.108.228:8080/ws_rest_T19916/public/api/');
define('URL_WEB_SERVICE', 'http://localhost/ws_rest/public/api/');
if (isset($_SERVER['HTTP_X_FORWARDED_PROTO'])) {
    define('BASE_URL', 'https://'.$_SERVER['HTTP_HOST'].'/'.PASTA.'/public/');
}else{
    define('BASE_URL', 'http://'.$_SERVER['HTTP_HOST'].'/'.PASTA.'/public/');
}
define('PUBLIC_URL', BASE_URL);
define('PUBLIC_RAIZ', realpath(__DIR__));
define('ERRO_VALIDACAO', '33226013');
define('LANGUAGE', 'pt-br');
define('IMG_LIMITS', array(
    'imagemSistemaMenu' => [280, 51],
    'imagemSistemaRelatorio' => [200, 95],
    'imagemSistemaLoginCentro' => [280, 150],
    'imagemSistemaLoginLateral' => [530, 900]
));


function removeAcentosRecursivo($dados) {
    $result = [];
    foreach ($dados as $key => $a) {
        if (count($a) > 1) {
            $result[$key] = removeAcentosRecursivo($dados[$key]);
            continue;
        }

        $result[$key] = removeAcentos($a);
    }

    return $result;
}

function removeAcentos($texto)
{
    $comAcento = [
        "á", "à", "â", "ã", "ä",
        "é", "è", "ê", "ë",
        "í", "ì", "î", "ï",
        "ó", "ò", "ô", "õ", "ö",
        "ú", "ù", "û", "ü", "ç",
        "Á", "À", "Â", "Ã", "Ä",
        "É", "È", "Ê", "Ë",
        "Í", "Ì", "Î", "Ï",
        "Ó", "Ò", "Ô", "Õ", "Ö",
        "Ú", "Ù", "Û", "Ü", "Ç", "'", "´", "€"
    ];

    $semAcento = [
        "a", "a", "a", "a", "a",
        "e", "e", "e", "e",
        "i", "i", "i", "i",
        "o", "o", "o", "o", "o",
        "u", "u", "u", "u", "c",
        "A", "A", "A", "A", "A",
        "E", "E", "E", "E",
        "I", "I", "I", "I",
        "O", "O", "O", "O", "O",
        "U", "U", "U", "U", "C", "", "", "C"
    ];

    return str_replace($comAcento, $semAcento, $texto);
}

// Setup autoloading
require 'init_autoloader.php';
include '../data/DoctrineORMModule/Proxy/__CG__ApplicationModelPessoa.php';
// Run the application!
$app = Zend\Mvc\Application::init(require 'config/application.config.php');
//$sistemaRegistroService = $app->getServiceManager()->get('Application\Service\SistemaRegistroService');
//$timeZone = $sistemaRegistroService->getValorByChaveAndSessao('PHP_TIME_ZONE', 'TRAFEGUS_WEB_TIME_ZONE');
//date_default_timezone_set($timeZone ? $timeZone : 'Etc/GMT+3');

date_default_timezone_set('Etc/GMT+3');
$data = new \DateTime('now');

define('HOJE_DATE', $data->format('Ymd'));
define('ONTEM_DATE', $data->modify('-1 day')->format('Ymd'));

$app->run();
?>
