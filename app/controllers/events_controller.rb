class EventsController < ApplicationController
  before_action :set_event, only: [:show, :edit, :update, :destroy]

  # GET /events
  def index
    @events = Event.all
  end

  # GET /events/1
  def show
  end

  # GET /events/new
  def new
    @event = Event.new
  end

  # GET /events/1/edit
  def edit
  end

  # POST /events
  def create
    @event = Event.new(event_params)

    if @event.save
      redirect_to @event, notice: 'Event was successfully created.'
    else
      render action: 'new'
    end
  end

  # PATCH/PUT /events/1
  def update
    if @event.update(event_params)
      redirect_to @event, notice: 'Event was successfully updated.'
    else
      render action: 'edit'
    end
  end

  # DELETE /events/1
  def destroy
    @event.destroy
    redirect_to events_url, notice: 'Event was successfully destroyed.'
  end

  private
  # Use callbacks to share common setup or constraints between actions.
  def set_event
    @event = Event.find(params[:id])
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  def event_params
    attrs = params.require(:event).permit(:series, :name, :speaker, :description, :date, :start, :length)
    date = filter_date(attrs, :date)
    start = filter_time(attrs, :start)
    attrs.merge({start: start, date: date})
  end

  def composed_param(attributes, name)
    attributes.collect do |key, value|
      if key =~ /^#{Regexp.escape(name.to_s)}\((\d+)([fi])\)$/
        attributes.delete(key)
        [$1.to_i, value.send("to_#$2")]
      end
    end.compact.sort_by(&:first).map(&:last)
  end

  def filter_time(attributes, name)
    attrs = composed_param(attributes, name)
    Time.zone.local(*attrs) if attrs.empty?
  end

  def filter_date(attributes, name)
    attrs = composed_param(attributes, name)
    Date.new(*attrs) unless attrs.empty?
  end
end
