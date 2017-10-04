# Icta

Icta is an idea repository. The idea behind it is quite simple: To have a central place where everybody can add ideas and vote on them.

This is also a sample application of how you can run a stack using:

- Elixir
- React + Redux + Webpack (ES6)
- Postgres
- Docker
- Sockets

## Development

### Dependencies

 * Elixir 1.4.2
 * Node 8.5.0
 * npm 3.10.10
 * Postgres 9.6.1

### Running the app

  * Install dependencies with `mix deps.get`
  * Create and migrate your database with `mix ecto.create && mix ecto.migrate` (make sure you have psql installed and configured, check `config/dev.exs`)
  * Run `npm install`
  * Install webpack with `npm install -g webpack` (Make sure you can run webpack on the console)
  * Configurate your google api credentials (check further down on the readme)
  * Run webpack using `webpack --watch --color`
  * Start Phoenix endpoint with `mix phoenix.server`

Now you can visit [`localhost:4000`](http://localhost:4000) from your browser.

### Configuring Google

1. Go to https://console.developers.google.com/
2. Create a new project
3. Go to the "Credentials" section and configure bot the OAuth client ID and yout API Key
4. Enable the "Google API" on the "Dashboard" section
5. Set the following environment vars with your keys:

```
    ICTA_GOOGLE_CLIENT_ID
    ICTA_GOOGLE_CLIENT_SECRET
    ICTA_GOOGLE_API_KEY
```

you may also set `ICTA_GOOGLE_ALLOWED_DOMAIN` if you are using your company google provider, that way only people using the google email with a certain domain will be allowed to log-in.

### Tests

run `mix test` :)

## SASS Lint

run `sass-lint -vq` 

## Production

### Docker

If you are using docker + docker-compose, it's quite easy:

First, build the container using `docker build -t <tag>`
Push your container to dockerhub (if you need to) `docker push <tag>`

Make your docker-compose.yml look something like this

```
icta:
  image: your/icta:tag
  command: mix phoenix.server
  environment:
    ICTA_GOOGLE_CLIENT_ID: your_google_client_id
    ICTA_GOOGLE_CLIENT_SECRET:: your_google_client_secret
    ICTA_GOOGLE_REDIRECT_URI: http://<your_icta_url>/auth/google/callback
    ICTA_GOOGLE_API_KEY: your_google_api_key
    ICTA_PORT: 4000
    ICTA_SECRET_KEY: something_very_random_goes_here
    ICTA_DATABASE_USERNAME: icta_app
    ICTA_HOST: <your_icta_url_again>
    ICTA_DATABASE_PASSWORD: icta_password
    ICTA_DATABASE_NAME: icta
    ICTA_DATABASE_HOST: your_database_host_without_port
    ICTA_TERMS_URL: https://<url_for_your_terms_and_conditions_file>

  ports:
    - 80:4000
```

Make sure to set the same ICTA_PORT on `ports` so you can access icta correctly

## Considerations

Icta is in a very very early stage, there are a lot of improvements to do, so use it with caution!

### Contributing

Check [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)
 
Icta is available under the [MIT](LICENSE.md) license.

And open a PR :)
