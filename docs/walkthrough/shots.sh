#!/usr/bin/env zsh
# Usage: shots.sh <out-dir>  — captures the app at common device widths via headless Chrome.
set -euo pipefail
out="${1:?out dir}"
mkdir -p "$out"
chrome="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
base="http://localhost:5173"

shot() { # name width height url
  "$chrome" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=2 \
    --window-size="$2,$3" --virtual-time-budget=12000 \
    --screenshot="$out/$1.png" "$4" >/dev/null 2>&1
  echo "$1 ($2x$3)"
}

shot iphone-se-search        320  568 "$base/?q=react%20state%20management"
shot iphone-14-search        390  844 "$base/?q=react%20state%20management"
shot iphone-14-search-p2     390  844 "$base/?q=react%20state%20management&page=2"
shot iphone-14-tracked-empty 390  844 "$base/tracked"
shot pixel-7-search          412  915 "$base/?q=react%20state%20management"
shot ipad-mini-search        768 1024 "$base/?q=react%20state%20management"
shot ipad-pro-search        1024 1366 "$base/?q=react%20state%20management"
shot laptop-search          1440  900 "$base/?q=react%20state%20management"
