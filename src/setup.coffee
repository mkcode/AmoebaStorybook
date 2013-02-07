# snockets does not support require_self, so this is the solution

window.AmoebaSB ?= {}

jQuery ($) ->
  AmoebaSB.eventHelper = new AmoebaSB.EventHelper