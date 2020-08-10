from django.contrib.gis.db import models
from gwml2.models.general import Quantity
from gwml2.models.term import TermAquiferType, TermConfinement


class PumpingTest(models.Model):
    """ Model for Pumping Test
    """
    # pumping test information
    porosity = models.FloatField(
        null=True, blank=True
    )
    hydraulic_conductivity = models.ForeignKey(
        Quantity, on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='pumping_test_hydraulic_conductivity'
    )
    transmissivity = models.ForeignKey(
        Quantity, on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='pumping_test_transmissivity'
    )
    specific_storage = models.ForeignKey(
        Quantity, on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='pumping_test_specific_storage'
    )
    storativity = models.FloatField(
        null=True, blank=True,
        verbose_name='Storativity / Specific yield'
    )
    specific_capacity = models.ForeignKey(
        Quantity, on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='pumping_test_specific_capacity'
    )
    test_type = models.CharField(
        null=True, blank=True, max_length=512
    )


class HydrogeologyParameter(models.Model):
    """ Model for hydrogeology parameter
    """

    aquifer_name = models.CharField(
        null=True, blank=True, max_length=512
    )
    aquifer_material = models.CharField(
        null=True, blank=True, max_length=512
    )
    aquifer_type = models.ForeignKey(
        TermAquiferType, on_delete=models.SET_NULL,
        null=True, blank=True
    )
    thickness = models.ForeignKey(
        Quantity, on_delete=models.SET_NULL,
        null=True, blank=True
    )
    confinement = models.ForeignKey(
        TermConfinement, on_delete=models.SET_NULL,
        null=True, blank=True
    )
    pumping_test = models.ForeignKey(
        PumpingTest, on_delete=models.SET_NULL,
        null=True, blank=True
    )