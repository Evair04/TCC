<?php


namespace Application\Form\Factory;

use Application\Form\PerfilMonitorPlanejamentoCargaForm;
use Doctrine\ORM\EntityManager;
use DoctrineModule\Stdlib\Hydrator\DoctrineObject;
use Zend\ServiceManager\FactoryInterface;
use Zend\ServiceManager\ServiceLocatorInterface;

class PerfilMonitorPlanejamentoCargaFormFactory implements FactoryInterface
{
    /**
     * @param ServiceLocatorInterface $serviceLocator
     * @return PerfilMonitorPlanejamentoCargaForm
     */
    public function createService(ServiceLocatorInterface $serviceLocator)
    {
        $perfilForm = new PerfilMonitorPlanejamentoCargaForm();

        $inputFilter = $serviceLocator->getServiceLocator()
            ->get('InputFilterManager')
            ->get('PerfilMonitorPlanejamentoCarga');

        /** @var EntityManager $entityManager */
        $entityManager = $serviceLocator->getServiceLocator()->get(EntityManager::class);

        $perfilForm->setInputFilter($inputFilter);

        $perfilForm->setHydrator(new DoctrineObject($entityManager));

        return $perfilForm;
    }
}