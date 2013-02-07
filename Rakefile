# encoding: utf-8

require 'rubygems'
require 'bundler'
begin
  Bundler.setup(:default, :development)
rescue Bundler::BundlerError => e
  $stderr.puts e.message
  $stderr.puts "Run `bundle install` to install missing gems"
  exit e.status_code
end
require 'rake'

require 'jeweler'
Jeweler::Tasks.new do |gem|
  gem.name = "amoeba-storybook"
  gem.homepage = "https://github.com/sgehrman/AmoebaStorybook"
  gem.license = "MIT"
  gem.summary = %Q{amoeba-storybook is a gem used to create animated css3 presentations.}
  gem.description = "amoeba-storybook is a gem used to create animated css3 presentations."
  gem.email = "sayhi@amoe.ba"
  gem.authors = ["Amoeba Consulting, LLC."]
end
Jeweler::RubygemsDotOrgTasks.new
