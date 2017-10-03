defmodule Icta.ConfigurationTest do
  use Icta.ModelCase

  import Icta.Factory

  alias Icta.Configuration

  @valid_attrs %{key: "some content", value: "some content", kind: "markdown"}
  @invalid_attrs %{user_id: 123}

  test "changeset with valid attributes" do
    changeset = Configuration.changeset(%Configuration{}, @valid_attrs)
    assert changeset.valid?
  end

  test "changeset with invalid attributes" do
    changeset = Configuration.changeset(%Configuration{}, @invalid_attrs)
    refute changeset.valid?
  end

  test "find_or_create should create when an element with the key passed doesnt exist" do
    Configuration.find_or_create("test1", "test2", "markdown")

    configuration = Repo.get_by!(Configuration, key: "test1")

    assert configuration.value == "test2"
  end

  test "find_or_create should not create when the key exists" do
    insert(:configuration)

    Configuration.find_or_create("test_key", "test2", "markdown")

    assert Repo.one(from c in "configurations", select: count(c.id)) == 1
  end

  test "fetch_all returns all configurations" do
    insert(:configuration)

    configs = Configuration.fetch_all

    assert length(configs) == 1
  end

  test "#update_key should update a given configuration value" do
    user = insert(:user)
    configuration = insert(:configuration, %{user: user})

    assert configuration.value == "test_value"

    {:ok, config} = Configuration.update_key("test_key", "new_value", user)

    assert config.value == "new_value"


  end
end
