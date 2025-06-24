# DjinnSecurities Desktop Shortcut Creator
# Creates a desktop shortcut for DjinnSecurities - Sovereign Watcher of Digital Integrity

$WshShell = New-Object -comObject WScript.Shell
$Desktop = $WshShell.SpecialFolders.Item("Desktop")

# Get the current directory where the script is running
$CurrentDir = (Get-Location).Path
$DjinnSecuritiesPath = Join-Path $CurrentDir "DjinnSecurities.html"

# Create shortcut
$Shortcut = $WshShell.CreateShortcut("$Desktop\DjinnSecurities.lnk")
$Shortcut.TargetPath = "C:\Program Files\Google\Chrome\Application\chrome.exe"
$Shortcut.Arguments = "--new-window --app=`"file:///$DjinnSecuritiesPath`""
$Shortcut.WorkingDirectory = $CurrentDir
$Shortcut.Description = "DjinnSecurities - Sovereign Watcher of Digital Integrity"
$Shortcut.IconLocation = "C:\Program Files\Google\Chrome\Application\chrome.exe,0"
$Shortcut.Save()

Write-Host "🛡️ DjinnSecurities desktop shortcut created successfully!" -ForegroundColor Green
Write-Host "Location: $Desktop\DjinnSecurities.lnk" -ForegroundColor Yellow
Write-Host "Target: $DjinnSecuritiesPath" -ForegroundColor Yellow
Write-Host ""
Write-Host "🜂 DjinnSecurities is now ready to serve as your Sovereign Watcher of Digital Integrity." -ForegroundColor Cyan 