defmodule Icta.Idea do
  use Icta.Web, :model

  schema "ideas" do
    field :title, :string
    field :body, :string
    field :status, :string
    field :category, :string
    field :deny_reason, :string
    belongs_to :user, Icta.User
    belongs_to :owner, Icta.User
    has_many :comments, Icta.Comment, on_delete: :delete_all
    has_many :votes, Icta.Vote, on_delete: :delete_all

    timestamps()
  end

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:title, :body, :user_id, :owner_id, :status, :category, :deny_reason])
    |> validate_required([:title, :user_id])
    |> validate_inclusion(:status, ["under_review", "denied", "new", "planned", "in_progress", "done"])
    |> validate_inclusion(:category, ["business", "company", "office"])
  end

  def all_with_votes(user) do
    Icta.Repo.all vote_count_query(user)
  end

  def one_with_votes(idea_id, user) do
    [idea | _] = Icta.Repo.all from i in vote_count_query(user),
                          where: i.id == ^idea_id
    idea
  end

  def approve(idea_id, user) do
    idea = Icta.Repo.get!(Icta.Idea, idea_id)

    changeset = Icta.Idea.changeset(idea, %{ status: "new" })
    Icta.Repo.update(changeset)
  end

  def deny(idea_id, reason, user) do
    idea = Icta.Repo.get!(Icta.Idea, idea_id)

    changeset = Icta.Idea.changeset(idea, %{ status: "denied", deny_reason: reason })
    Icta.Repo.update(changeset)
  end

  defp vote_count_query(user) do
    query = from i in Icta.Idea,
      left_join: v_up in Icta.Vote, on: i.id == v_up.idea_id and v_up.vote == true,
      left_join: v_down in Icta.Vote, on: i.id == v_down.idea_id and v_down.vote == false,
      left_join: my_vote in Icta.Vote, on: i.id == my_vote.idea_id and my_vote.user_id == ^user.id,
      left_join: comments in Icta.Comment, on: i.id == comments.idea_id,
      left_join: owner in Icta.User, on: i.owner_id == owner.id,
      inner_join: user in Icta.User, on: i.user_id == user.id,
      select: %{id: i.id, title: i.title, body: i.body, category: i.category, deny_reason: i.deny_reason,
        author: %{ name: user.name, id: user.id, image_url: user.image_url },
        owner: %{ name: owner.name, id: owner.id, image_url: owner.image_url },
        up: count(v_up.id, :distinct), down: count(v_down.id, :distinct), my_vote: my_vote.vote,
        comments_count: count(comments.id, :distinct), status: i.status},
      group_by: [i.id, i.title, i.body, i.status, user.name, user.id, owner.id, my_vote.vote]

    query = if user.kind == "user" do
        from i in query, where: ( i.status != "under_review" and i.status != "denied" ) or i.user_id == ^user.id
      else
        query
      end

    query
  end

end
