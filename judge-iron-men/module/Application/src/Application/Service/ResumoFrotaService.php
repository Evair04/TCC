<?php

namespace Application\Service;

use Base\Service\AbstractService;

class ResumoFrotaService extends AbstractService
{

    public function getCompeticao($cond){

        $selectDados = $this->getEm()->createQueryBuilder();

        $selectDados->select(array(
            'comp.identificador as identificador',
        ))
            ->distinct()
            ->from('Application\Model\Competicao', 'comp')
            ->setMaxResults((int) $cond['length'])
            ->setFirstResult((int) $cond['start']);


        if($cond['search']['value']){

            if(strlen($cond['search']['value']) > 9){
                $filtroInt = 0;

            }else{
                $filtroInt = (int) $cond['search']['value'];
            }

            $selectDados->where("comp.id = :filtroInt OR
                        lower(comp.identificador) LIKE lower(:filtro)")
                ->setParameter('filtro', "%".$cond['search']['value']."%")
                ->setParameter('filtroInt', $filtroInt);
        }

        $result = $selectDados->getQuery()->getResult();
        foreach ($result as $key => $r){
            $result[$key]['tempoTotal'] = $this->buscaTempoTotal($result[$key]['identificador']);
        }
        usort($result, function($a, $b) {
            return $a['tempoTotal'] <=> $b['tempoTotal'];
        });
        foreach ($result as $key => $r){
            $result[$key]['posicao'] = $key+1;
        }
        return $result;

    }
    public function getTodosRegistros($cond){

        $selectDados = $this->getEm()->createQueryBuilder();

        $selectDados->select(array(
            'comp.tempoTotal as tempoTotal',
            'comp.pista as pista',
            "TO_CHAR(comp.tempoInicial, 'HH24:MI:SS') as tempoInicial",
            "TO_CHAR(comp.tempoFinal, 'HH24:MI:SS') as tempoFinal"
        ))
            ->distinct()
            ->from('Application\Model\Competicao', 'comp')
            ->where("comp.identificador = '{$cond['identificador']}'")
            ->orderBy("comp.pista", "ASC");

        $result = $selectDados->getQuery()->getResult();
        //var_dump($result);exit;
        return $result;

    }

    public function getTotal(){
        $selectTotal = $this->getEm()->createQueryBuilder();
        $selectTotal->select('count(comp.id)')
            ->from('Application\Model\Competicao', 'comp');
        $total = $selectTotal->getQuery()->getSingleScalarResult();
        return $total;
    }
    public function getTotalFiltrado($value){


        $selectTotalFiltrado = $this->getEm()->createQueryBuilder();
        $selectTotalFiltrado->select('count(comp.id)')
            ->from('Application\Model\Competicao', 'comp');


        if($value){

            //TODO: Ajsutar retorno para previnir int = 0 no filtro (corrigir em todos os services)

            if(strlen($value) > 9){
                $filtroInt = 0;

            }else{
                $filtroInt = (int) $value;
            }

            $selectTotalFiltrado->where("comp.id = :filtroInt OR
                        lower(comp.identificador) LIKE lower(:filtro) OR
                        TO_CHAR(comp.tempoInicial, 'HH24:MI:SS') LIKE :filtro OR
                        TO_CHAR(comp.tempoFinal, 'HH24:MI:SS') LIKE :filtro OR
                        TO_CHAR(comp.tempoTotal, 'HH24:MI:SS') LIKE :filtro")
                ->setParameter('filtro', "%".$value."%")
                ->setParameter('filtroInt', $filtroInt);
        }

        return $selectTotalFiltrado->getQuery()->getSingleScalarResult();
    }

    public function buscaTempoTotal($identificador){
        $selectDados = $this->getEm()->createQueryBuilder();

        $selectDados->select(array(
            'SUM(comp.tempoTotal) as tempoTotal',
        ))
            ->from('Application\Model\Competicao', 'comp')
            ->where("comp.identificador = '$identificador'");

        $result = $selectDados->getQuery()->getResult();

        return $result[0]['tempoTotal'];


    }
}
