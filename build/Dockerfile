# Build Geth in a stock Go builder container
FROM golang:1.11-alpine as builder

RUN apk add --no-cache make gcc musl-dev linux-headers git jq nodejs npm yarn

COPY src /usr/src

WORKDIR /usr/src/admin-server
RUN ls -l
RUN npm install

WORKDIR /usr/src/admin-client
RUN yarn install
RUN yarn build

WORKDIR /usr/src/app

ARG BRANCH=v1.8.17

RUN git clone -b $BRANCH https://github.com/ethereum/go-ethereum.git
RUN cd go-ethereum && make geth

RUN git clone https://github.com/goerli/testnet.git
RUN mkdir -p /goerli && cp /usr/src/app/testnet/geth/goerli.genesis /goerli/goerli.genesis
RUN /usr/src/app/go-ethereum/build/bin/geth --datadir /goerli init /goerli/goerli.genesis  
RUN cat /usr/src/app/testnet/bootnodes.txt | jq -R '[.]' | jq -s 'add' > /goerli/geth/static-nodes.json

# Pull Geth into a second stage deploy alpine container
FROM alpine:latest

RUN apk add --no-cache ca-certificates
COPY --from=builder /usr/src/app/go-ethereum/build/bin/geth /usr/local/bin/
COPY --from=builder /goerli /goerli 
COPY --from=builder /usr/src/admin-server /usr/share/admin-server
COPY --from=builder /usr/src/admin-client/build /usr/share/admin-client/build

EXPOSE 4567 30303 30303/udp 30304/udp
ENTRYPOINT node /usr/src/admin-server/server.js && geth --datadir /goerli --rpc --rpccorsdomain "*" --rpcaddr="0.0.0.0" --rpcvhosts "*" --ws --wsaddr="0.0.0.0" --wsorigins="*" --networkid=6284 --password /usr/src/admin-server/data/password --keystore /usr/src/admin-server/data/keystore $EXTRA_OPTS