<?php


namespace WebService\Controller;


use Api\Controller\AbstractController;
use Api\Form\CompeticaoForm;
use Api\Model\Competicao;
use Doctrine\ORM\EntityManager;
use Zend\EventManager\EventManagerInterface;
use Zend\View\Model\JsonModel;

class CompeticaoController extends AbstractController
{
    protected $allowedCollectionMethods = array(
        'GET',
        'POST',
        'OPTIONS',
    );
    protected $allowedResourceMethods = array(
        'GET',
        'PATCH',
        'PUT',
        'DELETE',
        'OPTIONS',
    );
    protected $em;



    /**
     * @return EntityManager
     */
    public function getEntityManager()
    {
        if (null === $this->em) {
            $this->em = $this->getServiceLocator()->get('doctrine.entitymanager.orm_default');
        }
        return $this->em;
    }

    public function setEventManager(EventManagerInterface $events) {
        parent::setEventManager($events);
        $events->attach('dispatch', array($this, 'checkOptions'), 10);
    }

    public function checkOptions($e) {
        $matches = $e->getRouteMatch();
        $response = $e->getResponse();
        $request = $e->getRequest();
        $method = $request->getMethod();

        if ($matches->getParam('id', false)) {
            if (!in_array($method, $this->allowedResourceMethods)) {
                $response->setStatusCode(405);
                return $response;
            }
            return;
        }

        if (!in_array($method, $this->allowedCollectionMethods)) {
            $response->setStatusCode(405);
            return $response;
        }
    }

    public function create($dado)
    {

        foreach ($dado as $data) {
            $this->getEntityManager()->beginTransaction();
            try {
                $form = new CompeticaoForm();
                $competicao = new Competicao();
                $form->setInputFilter($competicao->getInputFilter());
                $form->setData($data);

                if (!$form->isValid()) {
                    throw new \Exception($form->getMessages());
                }
                $exiteRegistro = $this->getEntityManager()
                    ->getRepository('Api\Model\Competicao')
                    ->findOneBy(['identificador' => $data['motocicleta'], 'dataFinal' => null]);

                $exiteRegistroComFim = $this->getEntityManager()
                    ->getRepository('Api\Model\Competicao')
                    ->findOneBy(['identificador' => $data['motocicleta']], ['pista' => 'DESC']);
                if ($exiteRegistro){
                    $exiteRegistro->setDataFinal(\DateTime::createFromFormat('dmYHis', $data['key']));
                    $interval = $exiteRegistro->getDataInicial()->diff($exiteRegistro->getDataFinal())->format("%dd %Hh %im %ss");
                    $exiteRegistro->setTempoTotal($interval);
                    $this->getEntityManager()->persist($exiteRegistro);
                    $this->getEntityManager()->flush();
                }else {
                    $competicao->setDataCadastro(new \DateTime("now"));
                    $competicao->setDataInicial(\DateTime::createFromFormat('dmYHis', $data['key']));
                    $competicao->setIdentificador($data['motocicleta']);
                    if ($exiteRegistroComFim && $exiteRegistroComFim->getDataFinal())
                        $competicao->setPista($exiteRegistroComFim->getPista()+1);
                    else{
                        $competicao->setPista(1);
                    }
                    $this->getEntityManager()->persist($competicao);
                    $this->getEntityManager()->flush();
                }
                $this->getEntityManager()->commit();
                $this->getResponse()->setStatusCode(201);
                $resp = ['error' => ['code' => 0, 'message' => 'Enviado com sucesso']];
            } catch (\Exception $e) {
                $this->getEntityManager()->rollBack();
                $this->getResponse()->setStatusCode(409);
                $resp = ['error' => ['code' => 409, 'message' => $e->getMessage()]];
            }
        }
        $this->getResponse()->setStatusCode(200);

        return new JsonModel($resp);
    }

    public function update($id, $dados)
    {
        $query = $this->getEntityManager()->createQuery('DELETE FROM Api\Model\Competicao comp' );
        try {
            $query->execute();
            $resp = ['error' => ['code' => 0, 'message' => 'Limpado a base']];
        } catch (\Exception $e) {
            error_log($e->getMessage(),0);
            $resp = ['error' => ['code' => 0, 'message' => 'Erro ao limpar base']];
        }
        return new JsonModel($resp);
    }


}