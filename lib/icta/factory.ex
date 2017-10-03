defmodule Icta.Factory do
  use ExMachina.Ecto, repo: Icta.Repo

  def user_factory do
    %Icta.User{
      uid: sequence(:email, &"uid-#{&1}"),
      name: "John Doe",
      kind: "user"
    }
  end

  def idea_factory do
    %Icta.Idea{
      title: sequence(:email, &"Title #{&1}"),
      user: build(:user)
    }
  end

  def vote_factory do
    %Icta.Vote{
      idea: build(:idea),
      user: build(:user),
      vote: true,
    }
  end

  def configuration_factory do
    %Icta.Configuration{
      user: build(:user),
      kind: "markdown",
      value: "test_value",
      key: "test_key",
    }
  end
end
