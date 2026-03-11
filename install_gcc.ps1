Write-Host "Installing MSYS2 via winget..."
winget install -e --id MSYS2.MSYS2 --accept-source-agreements --accept-package-agreements

Write-Host "Waiting briefly for MSYS2 installation to finalize..."
Start-Sleep -Seconds 5

Write-Host "Updating MSYS2 packages..."
# Run pacman to update core packages.
& "C:\msys64\usr\bin\pacman.exe" -Syu --noconfirm

Write-Host "Installing MinGW-w64 GCC..."
& "C:\msys64\usr\bin\pacman.exe" -S mingw-w64-x86_64-gcc --noconfirm

Write-Host "Adding to User PATH..."
$userPath = [Environment]::GetEnvironmentVariable("Path", "User")
$mingwBin = "C:\msys64\mingw64\bin"

if ($userPath -notmatch [regex]::Escape($mingwBin)) {
    if (-not [string]::IsNullOrWhiteSpace($userPath) -and -not $userPath.EndsWith(";")) {
        $newPath = $userPath + ";" + $mingwBin
    } else {
        $newPath = $userPath + $mingwBin
    }
    [Environment]::SetEnvironmentVariable("Path", $newPath, "User")
    Write-Host "Added $mingwBin to User PATH. You may need to restart your terminal or IDE."
} else {
    Write-Host "$mingwBin is already in User PATH."
}

# Verify locally in this script
$env:Path += ";$mingwBin"
Write-Host "Testing g++:"
g++ --version
