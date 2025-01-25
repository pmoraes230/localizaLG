from django.db import models


class TbCategory(models.Model):
    id_category = models.AutoField(primary_key=True)
    name = models.CharField(max_length=45)

    class Meta:
        managed = False
        db_table = 'tb_category'
    
    def __str__(self):
        return self.name


class TbSchoolslg(models.Model):
    id_schoolslg = models.AutoField(db_column='id_SchoolsLG', primary_key=True)
    name = models.CharField(max_length=45)
    image = models.ImageField(upload_to="images/")
    address = models.CharField(max_length=45)
    latitude = models.DecimalField(max_digits=30, decimal_places=6)
    longitude = models.DecimalField(max_digits=50, decimal_places=6)
    id_category = models.ForeignKey(TbCategory, models.DO_NOTHING, db_column='id_category')

    class Meta:
        managed = False
        db_table = 'tb_schoolslg'

    def __str__(self):
        return self.name
