<?php
/*
{************************************************************************}
{                                                                        }
{       CHP Soluções em Tecnologia                                       }
{       Produto da Familia Trafegus                                      }
{                                                                        }
{       Copyright (c) 2011-2018                                          }
{       TODOS OS DIREITOS RESERVADOS                                     }
{                                                                        }
{   Todos os conteúdos deste arquivo é protegido                         }
{   por leis internacionasis de registro e patente.                      }
{   A reprodução não autorizada, engenharia reversa ou distribuição      }
{   de todos ou parte do codigo contidos neste arquivo são               }
{   estritamente proibidas e podem resultar em severas penalidades       }
{   civis e criminais, processados na máxima extensão possível ao        }
{   abrigo da lei.                                                       }
{                                                                        }
{   RESTRIÇÕES                                                           }
{                                                                        }
{   ESTE CÓDIGO FONTE E TODOS OS ARQUIVOS RESULTANTES (PHP, CSS, JS, ETC)}
{   SÃO CONFIDENCIAIS E PROPRIETÁRIAS, COM DIREITOS COMERCIAIS           }
{   EXCLUSIVO DA CHP SOLUÇÕES LTDA EPP.                                  }
{   O CÓDIGO-FONTE CONTIDO DENTRO DESTE ARQUIVO OU QUALQUER PARTE DO     }
{   SEU CONTEÚDO, NÃO PODE SER COPIADO, TRASFERIDO, VENDIDO OU           }
{   DISTRIBUÍDO DE OUTRA FORMA PARA OUTRAS PESSOAS SEM CONSENTIMENTO     }
{   EXPRESSO POR ESCRITO SEDIDO PELA CHP SOLUÇÕES LTDA EPP.              }
{   PARA MAIS INFORMAÇÕES CONSULTAR O CONTRATO DE LICENÇA DE USO E       }
{   SUAS RESTRIÇOES ADICIONAIS.                                          }
*/


namespace Application\Exception;


class EmailException extends \Exception
{
    const MENSAGEM_ERRO = 'Não foi possível efetivar a viagem, pois há itens do diário de bordo inconformes. Favor verificar com o motorista.';
    private $conteudo;

    public function __construct($conteudo = [])
    {
        parent::__construct(self::MENSAGEM_ERRO);
        $this->conteudo = $conteudo;
    }

    public function setConteudo(array $conteudo) {
        $this->conteudo = $conteudo;
    }

    public function getConteudo() {
        return $this->conteudo;
    }

}