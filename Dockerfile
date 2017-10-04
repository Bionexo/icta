FROM elixir:1.4

RUN curl https://nodejs.org/download/release/v8.5.0/node-v8.5.0-linux-x64.tar.gz | tar -xz -C /usr/local --strip-components=1

ENV MIX_ENV prod

COPY . /icta
WORKDIR /icta

RUN mix local.hex --force && mix local.rebar --force &&  mix deps.get --force && mix compile
RUN npm install  && node_modules/webpack/bin/webpack.js

RUN mix phoenix.digest
CMD mix run
