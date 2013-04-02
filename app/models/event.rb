class Event
  include Mongoid::Document
  include Mongoid::Timestamps # adds created_at and updated_at fields

  field :series, type: String
  field :name, type: String
  field :speaker, type: String
  field :description, type: String
  field :start, type: Time
  field :length, type: Integer

  # You can define indexes on documents using the index macro:
  # index :field <, :unique => true>

  # You can create a composite key in mongoid to replace the default id using the key macro:
  # key :field <, :another_field, :one_more ....>
end
