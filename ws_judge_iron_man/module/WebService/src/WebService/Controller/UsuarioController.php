<?php
namespace WebService\Controller;


use Zend\EventManager\EventManagerInterface;
use Zend\View\Model\JsonModel;

use Api\Controller\AbstractController;
use Api\Model\Usuario;
use Api\Model\Pessoa;
use Api\Model\PessoaFisica;
use Api\Form\UsuarioForm;


class UsuarioController extends AbstractController
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

    public function getEntityManager()
    {
        if (null === $this->em) {
            $this->em = $this->getServiceLocator()->get('doctrine.entitymanager.orm_default');
        }
        return $this->em;
    }

    public function setEventManager(EventManagerInterface $events)
    {
        parent::setEventManager($events);
        $events->attach('dispatch', array($this, 'checkOptions'), 10);
    }

    public function checkOptions($e)
    {
        $matches  = $e->getRouteMatch();
        $response = $e->getResponse();
        $request  = $e->getRequest();
        $method   = $request->getMethod();

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

    public function getList()
    {

        if($this->params()->fromQuery('aboutme')){
            $usua = $this->getEvent()->getParam('user');

            return new JsonModel(array(
                'data' => array(
                    'id' => $usua->getId(),
                    'nome' => $usua->getPessoaFisica()->getPessoa()->getNome(),
                    'sobrenome' => $usua->getPessoaFisica()->getPessoa()->getSobrenome(),
                    'login' => $usua->getLogin(),
                    'cpf' => $usua->getPessoaFisica()->getCpf(),
                    'email' => $usua->getEmail(),
                    'ativo' => $usua->getAtivo(),
                    'datacadastro' => $usua->getDataCadastro()
                )
            ));

        }

        $usuarios = $this->getEntityManager()->getRepository('Api\Model\Usuario')->findAll();

        $data = array();
        foreach($usuarios as $usuario) {

            $data[] = array(
                'id' => $usuario->getId(),
                'nome' => $usuario->getPessoaFisica()->getPessoa()->getNome(),
                'sobrenome' => $usuario->getPessoaFisica()->getPessoa()->getSobrenome(),
                'login' => $usuario->getLogin(),
                'cpf' => $usuario->getPessoaFisica()->getCpf(),
                'email' => $usuario->getEmail(),
                'ativo' => $usuario->getAtivo(),
                'datacadastro' => $usuario->getDataCadastro()
            );
        }

        return new JsonModel(array(
            'data' => $data,
        ));
    }

    public function get($id)
    {
        $usuario = $this->getEntityManager()->find('Api\Model\Usuario', $id);

        if($usuario){
            return new JsonModel(array(
                'data' => array(
                    'id' => $usuario->getId(),
                    'nome' => $usuario->getPessoaFisica()->getPessoa()->getNome(),
                    'sobrenome' => $usuario->getPessoaFisica()->getPessoa()->getSobrenome(),
                    'login' => $usuario->getLogin(),
                    'cpf' => $usuario->getPessoaFisica()->getCpf(),
                    'email' => $usuario->getEmail(),
                    'ativo' => $usuario->getAtivo(),
                    'datacadastro' => $usuario->getDataCadastro()
                )
            ));
        }

        $this->getResponse()->setStatusCode(404);
    }

    public function create($data)
    {
        try {
            $form = new UsuarioForm();

            $pess = new Pessoa();
            $pfis = new PessoaFisica();
            $usua = new Usuario();

            $form->setInputFilter($usua->getInputFilter());
            $form->setData($data);

            if (!$form->isValid()) {
                throw new \Exception($form->getMessages());
            }

            $pess->exchangeArray($form->getData());
            $pfis->exchangeArray($form->getData());
            $usua->exchangeArray($form->getData());

            $dbPfis = $this->getEntityManager()->getRepository(PessoaFisica::class)
                ->findOneBy(['cpf' => $pfis->getCpf()]) ?: null;

            if ($dbPfis) {
                $dbUsua = $this->getEntityManager()->getRepository(Usuario::class)
                    ->findOneBy(['pessoafisica' => $dbPfis->getId()]) ?: null;

                if ($dbUsua) {
                    throw new \Exception('Este CPF já foi cadastrado em outra conta.');
                }
            }

            $dbUsua = $this->getEntityManager()->getRepository(Usuario::class)->findOneBy(['login' => $usua->getLogin()]);
            if ($dbUsua) {
                throw new \Exception('Este login não está disponível.');
            }

            $dbUsua = $this->getEntityManager()->getRepository(Usuario::class)->findOneBy(['email' => $usua->getEmail()]);
            if ($dbUsua) {
                throw new \Exception('Já existe uma conta com este email.');
            }

            $hoje = new \DateTime("now");

            $pess->setDataCadastro($hoje);
            $pfis->setDataCadastro($hoje);
            $usua->setDataCadastro($hoje);

            $this->getEntityManager()->persist($pess);

            $pfis->setId($pess->getId());
            $pfis->setPessoa($pess);
            $this->getEntityManager()->persist($pfis);

            empty($usua->getAtivo()) && $usua->setAtivo('S');
            $usua->setPessoaFisica($pfis);
            $this->getEntityManager()->persist($usua);
            $this->getEntityManager()->flush();

            $this->getResponse()->setStatusCode(201);
            $resp = [
                'data' => [
                    'id' => $usua->getId(),
                    'nome' => $usua->getPessoaFisica()->getPessoa()->getNome(),
                    'sobrenome' => $usua->getPessoaFisica()->getPessoa()->getSobrenome(),
                    'login' => $usua->getLogin(),
                    'cpf' => $usua->getPessoaFisica()->getCpf(),
                    'email' => $usua->getEmail(),
                    'ativo' => $usua->getAtivo(),
                    'datacadastro' => $usua->getDataCadastro()
                ]
            ];
        } catch (\Exception $e) {
            $this->getResponse()->setStatusCode(409);
            $resp = ['error' => ['code' => 409,'message' => $e->getMessage()]];
        }

        return new JsonModel($resp);
    }

    public function update($id, $data)
    {

        $id = (int) $id;

        if (!$id) {
            $this->getResponse()->setStatusCode(400);
            return new JsonModel(array(
                'error' => 'Código de identificação inválido',
            ));
        }

        $data["id"] = $id;

        $usua = $this->getEntityManager()->find('Api\Model\Usuario', $id);
        if (!$usua) {
            $this->getResponse()->setStatusCode(404);
            return new JsonModel(array(
                'error' => 'Registro não encontrado na base de dados',
            ));
        }

        $form = new UsuarioForm();
        $form->setInputFilter($usua->getInputFilter());
        $form->setData($data);

        if ($form->isValid()) {

            $pfis = $usua->getPessoaFisica();
            $pess = $pfis->getPessoa();

            $pess->exchangeArray($form->getData());
            $pfis->exchangeArray($form->getData());
            $usua->exchangeArray($form->getData());

            $this->getEntityManager()->merge($pess);
            $this->getEntityManager()->merge($pfis);
            $this->getEntityManager()->merge($usua);
            $this->getEntityManager()->flush();


            $this->getResponse()->setStatusCode(201);
            return new JsonModel(array(
                'data' => array(
                    'id' => $usua->getId(),
                    'nome' => $usua->getPessoaFisica()->getPessoa()->getNome(),
                    'sobrenome' => $usua->getPessoaFisica()->getPessoa()->getSobrenome(),
                    'login' => $usua->getLogin(),
                    'cpf' => $usua->getPessoaFisica()->getCpf(),
                    'email' => $usua->getEmail(),
                    'ativo' => $usua->getAtivo(),
                    'datacadastro' => $usua->getDataCadastro()
                ),
            ));
        }

        $this->getResponse()->setStatusCode(409);
        return new JsonModel(array(
            'error' => $form->getMessages(),
        ));
    }

    public function delete($id)
    {
        $usua = $this->getEntityManager()->find('Api\Model\Usuario', $id);

        if ($usua) {
            $pfis = $usua->getPessoaFisica();
            $pess = $pfis->getPessoa();
            $this->getEntityManager()->remove($usua);
            $this->getEntityManager()->remove($pfis);
            $this->getEntityManager()->remove($pess);
            $this->getEntityManager()->flush();

            $this->getResponse()->setStatusCode(202);
            return new JsonModel(array(
                'data' => 'deleted',
            ));
        }

        $this->getResponse()->setStatusCode(404);
    }

    public function options()
    {
        $response = $this->getResponse();
        $headers  = $response->getHeaders();

        if ($this->params()->fromRoute('id', false)) {
            $headers->addHeaderLine('Allow', implode(',', $this->allowedResourceMethods));
            return $response;
        }

        $headers->addHeaderLine('Allow', implode(',', $this->allowedCollectionMethods));
        return $response;
    }

}
