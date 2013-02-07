#= require_tree storybook
#= require_self

window.Amoebaa ?= {}

jQuery ($) ->
  Amoebaa.eventHelper = new Amoebaa.EventHelper
