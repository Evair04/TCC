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


namespace WebService\Service;


use WebService\Service\EmpresaService;
use Core\Service\Service;

class VeiculoService extends Service
{
    public function getVinculoVeiculoComEmpresa($veiculoId, $empresaId)
    {
        /** @var EmpresaService $sessao */
        $empresaService = $this->getService(EmpresaService::class);
        $tipoEmpresa = $empresaService->getTipoEmpresa($empresaId);
        $selectDados = $this->getObjectManager()->createQueryBuilder();

        if ($tipoEmpresa == 'TRANSPORTADOR') {
            $selectDados->select(array(
                'tvco'
            ))
                ->from('Api\Model\Pessoa', 'pess')
                ->join('Api\Model\VeiculoTransportador', 'vtra', 'WITH', "vtra.vtra_tran_pess_oras_codigo = pess.pess_oras_codigo")
                ->leftjoin('Api\Model\TipoVinculoContratual', 'tvco', 'WITH', "vtra.vtra_tvco_codigo = tvco.tvco_codigo")
                ->leftjoin('Api\Model\Veiculo', 'veic', 'WITH', "vtra.vtra_veic_oras_codigo = veic.veic_oras_codigo")
                ->where("pess.pess_oras_codigo = :pessoa AND veic.veic_oras_codigo = :veiculo")
                ->setParameter('pessoa', $empresaId)
                ->setParameter('veiculo', $veiculoId);

            return $selectDados->getQuery()->getOneOrNullResult();
        }

        if ($tipoEmpresa == 'EMBARCADOR') {
            $selectDados->select(array(
                'tvco'
            ))
                ->from('Api\Model\Pessoa', 'pess')
                ->join('Api\Model\VeiculoEmbarcador', 'vemb', 'WITH', "vemb.vemb_emba_pjur_pess_oras_codigo = pess.pess_oras_codigo")
                ->leftjoin('Api\Model\TipoVinculoContratual', 'tvco', 'WITH', "vemb.vemb_tvco_codigo = tvco.tvco_codigo")
                ->leftjoin('Api\Model\Veiculo', 'veic', 'WITH', "vemb.vemb_veic_oras_codigo = veic.veic_oras_codigo")
                ->where("pess.pess_oras_codigo = :pessoa AND veic.veic_oras_codigo = :veiculo")
                ->setParameter('pessoa', $empresaId)
                ->setParameter('veiculo', $veiculoId);

            return $selectDados->getQuery()->getOneOrNullResult();
        }

        return null;
    }
}