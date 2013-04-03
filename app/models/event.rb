class Event
  include Mongoid::Document
  include Mongoid::Timestamps # adds created_at and updated_at fields

  field :series, type: String
  field :name, type: String
  field :speaker, type: String
  field :description, type: String
  field :date, type: Date, default: ->{ Date.today }
  field :start, type: Time, default: ->{ '19:00' }
  field :length, type: Integer, default: 180

  default_scope desc(:created_at)

  # You can define indexes on documents using the index macro:
  # index :field <, :unique => true>

  # You can create a composite key in mongoid to replace the default id using the key macro:
  # key :field <, :another_field, :one_more ....>

  def self.latest
    self.first
  end
end
