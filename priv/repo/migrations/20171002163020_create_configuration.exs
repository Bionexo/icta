defmodule Icta.Repo.Migrations.CreateConfiguration do
  use Ecto.Migration

  def change do
    create table(:configurations) do
      add :key, :text
      add :value, :text
      add :user_id, references(:users, on_delete: :nothing)

      timestamps()
    end
    create index(:configurations, [:user_id])

  end
end
