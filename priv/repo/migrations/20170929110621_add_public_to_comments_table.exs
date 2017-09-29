defmodule Icta.Repo.Migrations.AddPublicToCommentsTable do
  use Ecto.Migration

  def change do
    alter table(:comments) do
      add :public, :boolean, default: true, null: false
    end
  end
end
