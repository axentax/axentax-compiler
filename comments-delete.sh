#!/bin/bash

CUSTOM_COMMENT="/*!
 * Axentax.js v1.0.0
 * Copyright (c) 2025 Mitsuru Yasuda
 * GPL-3.0 License
 *
 * use:
 * - tonaljs { chord, midi } - https://github.com/tonaljs/tonal
 * - decimal.js - https://github.com/MikeMcl/decimal.js
 */"

TARGET_DIR="./dist"

find "$TARGET_DIR" -type f -name "*.js" | while read -r file; do
  awk '
  BEGIN { in_comment = 0 }
  /\/\*!/ { in_comment = 1 }
  in_comment && /\*\// { in_comment = 0; next }
  !in_comment' "$file" > "${file}.tmp"
  echo "$CUSTOM_COMMENT" | cat - "${file}.tmp" > "$file"

  rm "${file}.tmp"
done

echo "wrote the license."
