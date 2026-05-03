$dicPath = "dictionaries\en_GB-ise.txt"
$outputPath = "dictionaries\en_GB-ise2.txt"

Get-Content $dicPath |
    Select-Object -Skip 1 |                          # skip the word count header
    ForEach-Object { ($_ -split "/")[0].Trim() } |   # strip affix flags
    Where-Object {
        $_ -match "^[a-zA-Z]" -and                  # exclude words starting with '
        $_ -notmatch "[0-9]" -and                    # exclude words containing numbers
        $_.Length -ge 4 -and                         # minimum length
        $_.Length -le 10                             # maximum length
    } |
    Sort-Object -Unique |                            # deduplicate
    Set-Content $outputPath

$lineCount = (Get-Content $outputPath | Measure-Object -Line).Lines
Write-Host "Word list generated with $lineCount lines"

Remove-Item -Path $dicPath -Force
Rename-Item -Path $outputPath -NewName "en_GB-ise.txt"
Write-Host "Done - en_GB-ise.txt is ready"