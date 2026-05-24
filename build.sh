#!/usr/bin/env bash
set -euo pipefail

echo "Cleaning previous builds..."
rm -rf out/ .next/

echo "Installing dependencies..."
npm install

echo "Building static export..."
npm run build

echo "Creating root index.html for default locale..."
cat > out/index.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>BITA Express</title>
  <meta http-equiv="refresh" content="0;url=/en/">
  <link rel="canonical" href="/en/">
</head>
<body>
  <script>location.href="/en/"</script>
  <a href="/en/">Go to BITA Express</a>
</body>
</html>
EOF

echo "Build complete. Output in out/"
