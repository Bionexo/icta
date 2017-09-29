defmodule Icta.QuarantineChannel do
  use Icta.Web, :channel

  alias Icta.Repo
  alias Icta.Idea
  alias Icta.Comment
  alias Icta.Vote
  alias Icta.User

  def join("quarantine", _params, socket) do
    {:ok, %{ }, socket }
  end

  def handle_in("quarantine:approve", params, socket) do
    authorize_admin!(socket)

    case Idea.approve(params["idea_id"], socket.assigns[:current_user]) do
      {:ok, _}        ->
        idea = Icta.Repo.one(from i in Icta.Idea,
          where: i.id == ^params["idea_id"],
          preload: [:user])
        |> serialize_idea

        Icta.Endpoint.broadcast_from! self(), "idea", "quarantine:approved", idea
        {:reply, {:ok, %{}}, socket }
      {:error, error} -> {:reply, {:error, error}, socket }
    end
  rescue
    e -> {:reply, {:error, %{error: e}}, socket}
  end

  def handle_in("quarantine:deny", params, socket) do
    authorize_admin!(socket)

    case Idea.deny(params["idea_id"], params["reason"], socket.assigns[:current_user]) do
      {:ok, _}        ->
        Icta.Endpoint.broadcast_from! self(), "idea", "quarantine:denied", Idea.one_with_votes(params["idea_id"], socket.assigns[:current_user])
        {:reply, {:ok, %{}}, socket }
      {:error, error} -> {:reply, {:error, error}, socket }
    end
  rescue
    e -> {:reply, {:error, %{error: e}}, socket}
  end

  defp authorize_admin!(socket) do
    # Reload the user to see if it has changed in the db
    user = Repo.get!(User, socket.assigns[:current_user].id)
    if user.kind != "admin", do: raise "unauthorized"
  end

  defp serialize_idea(idea) do
    %{
      id: idea.id,
      title: idea.title,
      body: idea.body,
      status: idea.status,
      category: idea.category,
      author: %{
        id: idea.user.id,
        name: idea.user.name,
        image_url: idea.user.image_url
      },
      up: 0,
      down: 0,
      comments_count: 0
    }
  end

end
