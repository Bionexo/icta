# Script for populating the database. You can run it as:
#
#     mix run priv/repo/seeds.exs
#
# Inside the script, you can read and write to any of your
# repositories directly:
#
#     Icta.Repo.insert!(%Icta.SomeModel{})
#
# We recommend using the bang functions (`insert!`, `update!`
# and so on) as they will fail if something goes wrong.
#
Icta.Configuration.find_or_create("home", nil, "markdown");
#TODO: Use configurations for term and conditions URL
#Icta.Configuration.find_or_create("terms", nil, "string");
