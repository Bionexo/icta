defmodule Icta.ConfigurationChannel do
  use Icta.Web, :channel

  alias Icta.Repo
  alias Icta.Idea
  alias Icta.Comment
  alias Icta.Vote
  alias Icta.Configuration

  def join("config", _params, socket) do
    {:ok, %{ }, socket }
  end

  def handle_in("get", _, socket) do
    {:reply, {:ok, %{configs: Icta.Configuration.fetch_all}}, socket}
  end


  def handle_in("set_config", params, socket) do
    authorize_admin!(socket)

    case Configuration.update_key(params["key"], params["value"], socket.assigns[:current_user]) do
      {:ok, config} ->
        broadcast! socket, "updated", %{key: config.key, value: config.value, user_id: config.user_id}
        {:reply, :ok, socket}
      {:error, error} ->
        {:reply, {:error, error}, socket}
    end
  rescue
    e -> {:reply, {:error, %{error: e}}, socket}
  end

  defp authorize_admin!(socket) do
    # Reload the user to see if it has changed in the db
    user = Repo.get!(User, socket.assigns[:current_user].id)
    if user.kind != "admin", do: raise "unauthorized"
  end
end
