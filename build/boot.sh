#!/bin/sh
node /usr/share/admin-server/server.js &
while true
do
    geth --datadir /goerli --rpc --rpccorsdomain "*" --rpcaddr="0.0.0.0" --rpcvhosts "*" --ws --wsaddr="0.0.0.0" --wsorigins="*" --networkid=6284 --password  /usr/share/admin-server/data/password --keystore /usr/share/admin-server/data/keystore --mine --unlock 0x68453de7fbb3605186ccf435c08512c2fa9591ef --$EXTRA_OPTS
    sleep 5
done

