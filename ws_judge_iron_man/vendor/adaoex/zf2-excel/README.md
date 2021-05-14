# ZF2Excel
==========

ZF2Excel, módulo para manipulação de arquivos  baseado no projeto PHPExcel (http://www.codeplex.com/PHPExcel)
PHPExcel - OpenXML - ler, escrever e criar documentos do Excel em PHP - motor Spreadsheet;

# Introdução

Projeto fornecendo um conjunto de classes para a linguagem de programação PHP, que permitem que você gravar e ler a partir de diferentes formatos de arquivo de planilha, como o Excel (BIFF) .xls, o Excel 2007 (OfficeOpenXML) .xlsx, CSV, Libre / .ods OpenOffice Calc , Gnumeric, PDF, HTML, ... Este projeto é construído em torno padrão OpenXML da Microsoft e PHP.
Finalizar as características deste conjunto classe fornece, como a criação de planilhas de metadados (autor, título, descrição, ...), várias folhas de cálculo, fontes diferentes e estilos de fonte, bordas de célula, preenchimentos, gradientes, adicionando imagens para sua planilha, calcular fórmulas , a conversão entre tipos de arquivos e muito, muito mais!
Este projeto é baseado no [PHPExcel](http://www.codeplex.com/PHPExcel)

## Características

* Gera XHTML validado pela W3C
* Impressão de carnês com quebra de página
* Altamente extensível
* Facilita integração banco de dados
* Gera código de barras em uma imagem apenas, utlizando `Zend\Barcode`

## Dependências
As dependências já serão resolvidas com a utilização do composer

* PHP >=5.3.3
* [Zend Framework 2.2.*](https://github.com/zendframework/zf2)
* PHP version 5.3.3 or higher
* PHP extension php_zip enabled
* PHP extension php_xml enabled
* PHP extension php_gd2 enabled (if not compiled in)

## Instalação via Composer

  1. `cd my/project/directory`
  2. criar um arquivo `composer.json` com o seguinte conteudo:

```json
     {
         "require": {
             "adaoex/zf2-excel": "dev-master"
         }
     }
```
  3. install PHP Composer via `curl -s http://getcomposer.org/installer | php` (on windows, download
     http://getcomposer.org/installer and execute it with PHP)
  4. executar `php composer.phar install`
  5. abrir `my/project/directory/config/application.config.php` e adicionar os seguinte código em `modules`: 

```php
	 'modules' => array(
		...
		'ZF2Excel',
	)
```
* até o momento nenhuma carteira implementara

## Utilização

[PHPExcel Examples](http://phpexcel.codeplex.com/wikipage?title=Examples&referringTitle=Home)
