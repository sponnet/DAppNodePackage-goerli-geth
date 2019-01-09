#!/bin/sh
node /usr/share/admin-server/server.js &
echo "GOERLI startup script v2"
while true
do
    if [[ -f /usr/share/admin-server/data/EXTRA_OPTS && -f /usr/share/admin-server/data/password && -f /usr/share/admin-server/data/keystore/wallet ]]; then
        export EXTRA_OPTS=$(cat /usr/share/admin-server/data/EXTRA_OPTS)
        echo "Extra opts $EXTRA_OPTS"
        geth --datadir /goerli --rpc --rpccorsdomain "*" --rpcaddr="0.0.0.0" --rpcvhosts "*" --ws --wsaddr="0.0.0.0" --wsorigins="*" $EXTRA_OPTS
        sleep 7
    else
        echo "Config files not present yet... waiting"
        sleep 7
    fi
done

