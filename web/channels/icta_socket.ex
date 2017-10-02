defmodule Icta.IctaSocket do
  use Phoenix.Socket

  alias Icta.Repo
  alias Icta.User

  ## Channels
  # channel "room:*", Icta.RoomChannel

  channel "idea", Icta.IdeaChannel
  channel "quarantine", Icta.QuarantineChannel
  channel "user", Icta.UserChannel
  channel "config", Icta.ConfigurationChannel

  ## Transports
  transport :websocket, Phoenix.Transports.WebSocket

  def connect(%{"token" => token}, socket) do
    case Phoenix.Token.verify(socket, "user socket", token, max_age: nil) do
      {:ok, user_id} ->
        user = Repo.get!(User, user_id)
        {:ok, assign(socket, :current_user, user)}
      {:error, _reason} ->
        :error
    end
  end

  def connect(_params, _socket), do: :error

  def id(socket), do: "users_socket:#{socket.assigns.current_user.id}"

end
