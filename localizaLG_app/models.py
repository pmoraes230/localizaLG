# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class TbCategory(models.Model):
    id_category = models.AutoField(primary_key=True)
    name = models.CharField(max_length=45)

    class Meta:
        managed = False
        db_table = 'tb_category'


class TbSchoolslg(models.Model):
    id_schoolslg = models.AutoField(db_column='id_SchoolsLG', primary_key=True)  # Field name made lowercase.
    name = models.CharField(max_length=45)
    image = models.ImageField(upload_to="")
    address = models.CharField(max_length=45)
    latitude = models.DecimalField(max_digits=30, decimal_places=0)
    longitude = models.DecimalField(max_digits=50, decimal_places=0)
    id_category = models.ForeignKey(TbCategory, models.DO_NOTHING, db_column='id_category')

    class Meta:
        managed = False
        db_table = 'tb_schoolslg'
