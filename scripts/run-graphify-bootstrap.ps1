$repoRoot = Split-Path -Parent $PSScriptRoot
$scriptPath = Join-Path $PSScriptRoot "build_graphify_bootstrap.py"

$candidates = @(
  "C:\Users\kev\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe"
)

if ($env:GRAPHIFY_PYTHON) {
  $candidates = @($env:GRAPHIFY_PYTHON) + $candidates
}

$candidates += @(
  "py -3",
  "python"
)

foreach ($candidate in $candidates) {
  try {
    if ($candidate -eq "py -3") {
      & py -3 $scriptPath
    } else {
      & $candidate $scriptPath
    }

    if ($LASTEXITCODE -eq 0) {
      exit 0
    }
  } catch {
    continue
  }
}

Write-Error "Impossible de lancer Graphify bootstrap. Definis GRAPHIFY_PYTHON ou installe Python accessible."
exit 1
