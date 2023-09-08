cp ./.env.development ./.env.production &&
sed -i'.bak' -e 's/VITE_REACT_APP_BASE_URL=/VITE_REACT_APP_BASE_URL=\/keyz-panel/g' ./.env.production &&
rm ./.env.production.bak
