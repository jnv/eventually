class Event
  include Mongoid::Document
  field :series, type: String
  field :name, type: String
  field :speaker, type: String
  field :description, type: String
  field :start, type: Time
  field :length, type: Integer
end
