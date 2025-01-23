from django.db import models

class Escolas_loc(models.Model):
    name = models.CharField(max_length=50)
    image = models.ImageField(upload_to='')
    address = models.CharField(max_length=100)
    latitude = models.FloatField(unique=True)
    longitude = models.FloatField(unique=True)
    category_Id = models.ForeignKey(Category, models.DO_NOTHING, db_column='category_Id')

class Category(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField('slug', editable=False)