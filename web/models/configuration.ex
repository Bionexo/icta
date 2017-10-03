defmodule Icta.Configuration do
  use Icta.Web, :model

  schema "configurations" do
    field :key, :string
    field :value, :string
    field :kind, :string
    belongs_to :user, Icta.User

    timestamps()
  end

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:key, :value, :kind])
    |> validate_required([:key, :kind])
    |> validate_inclusion(:kind, ["markdown", "string"])
  end

  def find_or_create(key, value, kind) do
    query = from c in Icta.Configuration,
            where: c.key == ^key

    if !Icta.Repo.one(query) do
      %Icta.Configuration{}
      |> Icta.Configuration.changeset(%{key: key, value: value, kind: kind})
      |> Icta.Repo.insert!
    end
  end

  def fetch_all do
    (from c in Icta.Configuration, select: %{ kind: c.kind, key: c.key, value: c.value })
    |> Icta.Repo.all
  end

  def update_key(key, value, user) do
    Icta.Configuration
    |> Icta.Repo.get_by!(key: key)
    |> Icta.Configuration.changeset(%{ key: key, value: value, user_id: user.id })
    |> Icta.Repo.update
  end
end
