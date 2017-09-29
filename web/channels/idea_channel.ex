defmodule Icta.IdeaChannel do
  use Icta.Web, :channel

  alias Icta.Repo
  alias Icta.Idea
  alias Icta.Comment
  alias Icta.Vote
  alias Icta.User

  intercept ["quarantine:new", "quarantine:denied"]

  def join("idea", _params, socket) do
    {:ok, %{ }, socket }
  end

  def handle_in("get_all", _, socket) do
    {:reply, {:ok, %{ ideas: Idea.all_with_votes(socket.assigns[:current_user]) }}, socket }
  end

  def handle_in("get", params, socket) do
    {:reply, {:ok, %{
      idea: Idea.one_with_votes(params["idea_id"], socket.assigns[:current_user]),
      comments: Comment.all_comments_for_idea(params["idea_id"], socket.assigns[:current_user])
    }}, socket }
  end

  def handle_in("delete", params, socket) do
    idea = get_idea(params["idea_id"], socket.assigns[:current_user])
    case Repo.delete(idea) do
      {:ok, _}        -> {:reply, {:ok, %{}}, socket }
      {:error, error} -> {:reply, {:error, error}, socket }
    end
  end

  def handle_in("new", params, socket) do
    current_user = socket.assigns[:current_user]
    result = current_user
             |> build_assoc(:ideas)
             |> Idea.changeset(params)
             |> Repo.insert

    case result do
      {:ok, idea } ->
				broadcast! socket, "quarantine:new", serialize_new_idea(idea, current_user)
				{:reply, {:ok, serialize_new_idea(idea, current_user)}, socket }
      {:error, error} ->
        {:reply, {:error, error }, socket }
    end
  end

  def handle_in("comment:new", params, socket) do
    result = socket.assigns[:current_user]
             |> build_assoc(:comments)
             |> Comment.changeset(params)
             |> Repo.insert

    case result do
      {:ok, _} -> {:reply, :ok, socket }
      {:error, error} -> {:reply, {:error, error }, socket }
    end
  end

  def handle_in("vote:new", params, socket) do
    result =
      case Repo.one(from vote in Vote,
                    preload: [:user, :idea],
                    where: vote.user_id == ^socket.assigns[:current_user].id and
                           vote.idea_id == ^params["idea_id"]) do
        nil -> socket.assigns[:current_user]
               |> build_assoc(:votes)
        vote -> vote
      end
      |> Vote.changeset(params)
      |> Repo.insert_or_update

    case result do
      {:ok, vote} ->
        broadcast! socket, "vote:new", Idea.one_with_votes(vote.idea_id, socket.assigns[:current_user])
        {:reply, :ok, socket}
      {:error, error} ->
        IO.puts("ERROR! #{inspect error}")
        {:reply, {:error, error }, socket }
    end
  end

  def handle_in("vote:remove", params, socket) do
    result =
      case Repo.one(from vote in Vote,
                    preload: [:user, :idea],
                    where: vote.user_id == ^socket.assigns[:current_user].id and
                           vote.idea_id == ^params["idea_id"]) do
        nil -> nil
        vote -> Repo.delete(vote)
      end

    case result do
      {:ok, vote} ->
        broadcast! socket, "vote:new", Idea.one_with_votes(vote.idea_id, socket.assigns[:current_user])
        {:reply, :ok, socket}
      {:error, error} ->
        IO.puts("ERROR! #{inspect error}")
        {:reply, {:error, error }, socket }
    end
  end

  def handle_in("user:get_all", _, socket) do
    users = Repo.all(from usr in User,
                     select: %{id: usr.id, name: usr.name, image_url: usr.image_url},
                     order_by: usr.name)
    {:reply, { :ok, %{ users: users } }, socket }
  end

  def handle_in("edit", params, socket) do
    idea = Repo.one(from idea in Idea,
                    where: (idea.id == ^params["idea_id"]) and (idea.user_id == ^socket.assigns[:current_user].id or
                            idea.owner_id == ^socket.assigns[:current_user].id))
    idea = Idea.changeset(idea, params["attributes"])
    case Repo.update(idea) do
      {:ok, _} ->
        broadcast! socket, "edit", Idea.one_with_votes(params["idea_id"], socket.assigns[:current_user])
        {:reply, :ok, socket }
      {:error, error} -> {:reply, {:error, error}, socket }
    end
  end

  def handle_out("quarantine:denied", msg, socket) do
    if socket.assigns[:current_user].id == msg.author.id do
      push socket, "quarantine:denied", msg
    end
    {:noreply, socket }
  end

  def handle_out("quarantine:new", msg, socket) do
    if socket.assigns[:current_user].kind == "admin" do
      push socket, "new", msg
    end
    {:noreply, socket}
  end

  defp get_idea(id, current_user) do
    Repo.get_by!(Idea, %{
                 user_id: current_user.id,
                 id: id })
  end

  defp serialize_new_idea(idea, current_user) do
    %{
      id: idea.id,
      title: idea.title,
      body: idea.body,
      status: "under_review",
      category: idea.category,
      author: %{
        id: current_user.id,
        name: current_user.name,
        image_url: current_user.image_url
      },
    up: 0,
    down: 0,
    comments_count: 0
  }
  end
end
