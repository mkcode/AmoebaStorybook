#= require_self
#= require_tree storybook

window.Amoebaa ?= {}

jQuery ($) ->
  Amoebaa.eventHelper = new Amoebaa.EventHelper
