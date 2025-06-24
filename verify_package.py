import zipfile
z = zipfile.ZipFile('DjinnSecurities_Package.zip')
print('Package contents:')
for f in z.namelist():
    print(f'  - {f}')
z.close() 