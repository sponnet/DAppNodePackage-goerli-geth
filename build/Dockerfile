# Build Geth in a stock Go builder container
FROM golang:1.11-alpine as builder

WORKDIR /usr/src/app

RUN apk add --no-cache make gcc musl-dev linux-headers git jq

ARG BRANCH=v1.8.17

RUN git clone -b $BRANCH https://github.com/ethereum/go-ethereum.git
RUN cd go-ethereum && make geth

RUN git clone https://github.com/goerli/testnet.git
RUN mkdir -p /goerli && cp /usr/src/app/testnet/geth/goerli.genesis /goerli/goerli.genesis
RUN /usr/src/app/go-ethereum/build/bin/geth --datadir /goerli init /goerli/goerli.genesis  
RUN cat /usr/src/app/testnet/bootnodes.txt | jq -R '[.]' | jq -s 'add' > /goerli/geth/static-nodes.json

# Pull Geth into a second stage deploy alpine container
FROM alpine:latest

RUN apk add --no-cache ca-certificates nodejs npm
COPY --from=builder /usr/src/app/go-ethereum/build/bin/geth /usr/local/bin/
COPY --from=builder /goerli /goerli 

EXPOSE 30303 30303/udp 30304/udp
ENTRYPOINT geth --datadir /goerli --rpc --rpccorsdomain "*" --rpcaddr="0.0.0.0" --rpcvhosts "*" --ws --wsaddr="0.0.0.0" --wsorigins="*" --networkid=6284