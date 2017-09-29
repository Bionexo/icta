defmodule Icta.Repo.Migrations.AddDenyReasonToIdea do
  use Ecto.Migration

  def change do
    alter table(:ideas) do
      add :deny_reason, :text
    end
  end
end
