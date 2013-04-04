class Event
  include Mongoid::Document
  include Mongoid::Timestamps # adds created_at and updated_at fields

  field :series, type: String
  field :name, type: String
  field :speaker, type: String
  field :description, type: String
  field :venue, type: String
  field :date, type: Date, default: ->{ Date.today }
  field :start, type: Time, default: ->{ '19:00' }
  field :length, type: Integer, default: 180

  field :facebook_id, type: Integer
  field :srazy_url, type: String
  field :gplus_url, type: String

  default_scope desc(:created_at)

  before_validation :set_start_date

  # You can define indexes on documents using the index macro:
  # index :field <, :unique => true>

  # You can create a composite key in mongoid to replace the default id using the key macro:
  # key :field <, :another_field, :one_more ....>

  def self.latest
    self.first
  end

  protected
  def set_start_date
    if date.is_a?(Date) && start.is_a?(Time)
      self.start = start.change(year: date.year, month: date.month, day: date.day)
    end
  end
end
