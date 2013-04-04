class EventsController < ApplicationController
  before_action :set_event, only: [:show, :edit, :update, :destroy]

  skip_before_filter :verify_authenticity_token, :only => [:latest]

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
    if @event.update_attributes(event_params)
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

  def latest
    @event = Event.latest
    respond_to do |format|
      format.html { render action: 'show' }
      format.js
    end
  end

  def bookmarklet
    @event = Event.latest
  end

  private
  # Use callbacks to share common setup or constraints between actions.
  def set_event
    @event = Event.find(params[:id])
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  def event_params
    params.require(:event).permit(:series, :name, :speaker, :description, :date, :start, :venue, :length, :facebook_id, :srazy_url, :gplus_url)
  end

end
