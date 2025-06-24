import zipfile
z = zipfile.ZipFile('DjinnSecurities_Package.zip', 'a')
z.write('README_DjinnSecurities.txt')
z.close()
print('README added to package') 