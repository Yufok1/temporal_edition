@echo off
echo Creating DjinnSecurities Package...
echo.

REM Create zip package using built-in Windows compression
powershell -Command "Add-Type -AssemblyName System.IO.Compression.FileSystem; [System.IO.Compression.ZipFile]::CreateFromDirectory('.', 'DjinnSecurities_Package.zip', [System.IO.Compression.CompressionLevel]::Optimal, $false)"

echo.
echo Package created: DjinnSecurities_Package.zip
echo.
pause 