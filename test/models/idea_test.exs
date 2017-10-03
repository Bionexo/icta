defmodule Icta.IdeaTest do
  use Icta.ModelCase

  import Icta.Factory

  alias Icta.Idea

  @valid_attrs %{title: "Create a Idea repository", body: "Create it!", user_id: 1}
  @invalid_attrs %{title: "Create a Idea repository", body: "Create it!"}

  test "changeset with valid attributes" do
    changeset = Idea.changeset(%Idea{}, @valid_attrs)
    assert changeset.valid?
  end

  test "changeset with invalid attributes" do
    changeset = Idea.changeset(%Idea{}, @invalid_attrs)
    refute changeset.valid?
  end

  test "all_with_votes should return all ideas" do
    user = insert(:user)
    insert_pair(:idea, %{user: user})

    ideas = Idea.all_with_votes(user)
    assert length(ideas) == 2
  end

  test "one_with_votes should return the first idea matched" do
    user = insert(:user)
    [idea | _] = insert_pair(:idea, %{user: user})

    # Assert two ideas are present
    ideas = Idea.all_with_votes(user)
    assert length(ideas) == 2

    idea_return = Idea.one_with_votes(idea.id, user)
    assert idea_return.id == idea.id
  end

  test "all_with_votes should return the correct vote count for the idea" do
    user = insert(:user)
    idea = insert(:idea, %{user: user})
    insert_list(5, :vote, %{idea: idea})
    insert_list(2, :vote, %{idea: idea, vote: false})

    idea_return = Idea.one_with_votes(idea.id, user)
    assert idea_return.up == 5
    assert idea_return.down == 2
  end

  test "the idea should be under_review by default" do
    user = insert(:user)
    insert(:idea, %{user: user})

    idea = Repo.one(from i in Idea)
    assert idea.status == "under_review"
  end

  test "#approve should mark an quarantined idea as new" do
    user = insert(:user)
    idea = insert(:idea, %{user: user})

    {:ok, _} = Idea.approve(idea.id, user)

    idea = Repo.get!(Idea, idea.id)

    assert idea.status == "new"
  end

  test "#deny should mark an quarantined idea as denied" do
    user = insert(:user)
    idea = insert(:idea, %{user: user})
    reason = "Test"

    {:ok, _} = Idea.deny(idea.id, reason, user)

    idea = Repo.get!(Idea, idea.id)

    assert idea.status == "denied"
    assert idea.deny_reason == "Test"
  end
end
