<?php
/*
 * ZF2Excel Module (https://github.com/adaoex/zf2-excel)
 * 
 * @author      Adão Gonçalves <adao@adao.eti.br>
 * @link        https://github.com/adaoex/zf2-base for the canonical source repository
 * @copyright   Copyright(c) 2015 (http://adao.eti.br)
 * @license     http://www.opensource.org/licenses/mit-license.php MIT License
 */

namespace ZF2Excel;

class Module {

    public function getConfig() {
        return include __DIR__ . '/config/module.config.php';
    }

    public function getAutoloaderConfig() {
        /** PHPExcel root directory */
        if (!defined('PHPEXCEL_ROOT')) {
            define('PHPEXCEL_ROOT', dirname(__FILE__) . '/src/');
            require(PHPEXCEL_ROOT . 'PHPExcel/Autoloader.php');
        }
        
        return array(
            'Zend\Loader\StandardAutoloader' => array(
                'namespaces' => array(
                    __NAMESPACE__ => __DIR__ . '/src/',
                ),
            ),
        );
    }

}

