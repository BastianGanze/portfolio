 ~/.local/bin/spacetime call tic-tac-toe clear_all_tables
 ~/.local/bin/spacetime publish --project-path . tic-tac-toe
 ~/.local/bin/spacetime generate --lang typescript --out-dir ../bg-app/bindings --project-path .
 cd ../bg-app && npx ts-node scripts/fix_spacetime_imports.ts