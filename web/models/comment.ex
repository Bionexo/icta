defmodule Icta.Comment do
  use Icta.Web, :model

  schema "comments" do
    field :body, :string
    field :public, :boolean
    belongs_to :user, Icta.User
    belongs_to :idea, Icta.Idea

    timestamps()
  end

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:body, :idea_id, :public])
    |> validate_required([:body, :idea_id, :public, :user_id])
  end

  def all_comments_for_idea(idea_id, user) do
    query = from c in Icta.Comment,
      left_join: user in Icta.User, on: c.user_id == user.id,
      select: %{id: c.id, body: c.body, created_at: c.inserted_at, public: c.public,
        author: %{ name: user.name, image_url: user.image_url }},
      where: c.idea_id == ^idea_id

    query = if user.kind == "user" do
        from c in query, where: c.public == true
      else
        query
      end

    Icta.Repo.all query
  end
end
