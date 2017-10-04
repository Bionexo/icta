defmodule Icta.CommentTest do
  use Icta.ModelCase

  import Icta.Factory

  alias Icta.Comment

  @valid_attrs %{body: "some content", idea_id: 123, public: true}
  @invalid_attrs %{}

  test "changeset with valid attributes" do
    changeset = Comment.changeset(%Comment{user_id: 1}, @valid_attrs)
    assert changeset.valid?
  end

  test "changeset with invalid attributes" do
    changeset = Comment.changeset(%Comment{}, @invalid_attrs)
    refute changeset.valid?
  end

  test "#all_comments_for_idea should return all comments for a certain idea" do
    user = insert(:user)
    idea = insert(:idea)
    insert(:comment, %{idea: idea, body: "comment1"})
    insert(:comment, %{idea: idea, body: "comment2"})

    comments = Comment.all_comments_for_idea(idea.id, user)

    assert length(comments) == 2
  end

  test "#all_comments_for_idea should order comments by date" do
    user = insert(:user)
    idea = insert(:idea)
    comment_1 = insert(:comment, %{idea: idea, body: "comment1"})
    comment_2 = insert(:comment, %{idea: idea, body: "comment2"})

    comments = Comment.all_comments_for_idea(idea.id, user)

    assert Enum.at(comments, 0).created_at > Enum.at(comments, 1).created_at
    assert Enum.at(comments, 0).id == comment_2.id
    assert Enum.at(comments, 1).id == comment_1.id
  end

  test "#all_comments_for_idea should return private comments when the user is an admin" do
    user = insert(:user, kind: "admin")
    idea = insert(:idea)
    insert(:comment, %{idea: idea, body: "comment1"})
    insert(:comment, %{idea: idea, body: "comment2", public: true})

    comments = Comment.all_comments_for_idea(idea.id, user)

    assert length(comments) == 2
  end

  test "#all_comments_for_idea should not return private comments when the user is not an admin" do
    user = insert(:user, kind: "user")
    idea = insert(:idea)
    insert(:comment, %{idea: idea, body: "comment1"})
    comment_2 = insert(:comment, %{idea: idea, body: "comment2", public: false})

    comments = Comment.all_comments_for_idea(idea.id, user)

    assert length(comments) == 1
    assert Enum.at(comments, 0).id != comment_2.id
  end
end
