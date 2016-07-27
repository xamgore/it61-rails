require "rails_helper"

RSpec.describe EventsController, type: :controller do
  before :each do
    @title = Forgery::LoremIpsum.title(random: true)
    @started_at = Time.now.change(sec: 0).change(usec: 0)
    @description = "Test"
    @data = {
      title: @title,
      title_image: "img.png",
      "started_at_date(1i)" => @started_at.year,
      "started_at_date(2i)" => @started_at.month,
      "started_at_date(3i)" => @started_at.day,
      "started_at_time(4i)" => @started_at.hour,
      "started_at_time(5i)" => @started_at.min,
      description: @description,
      place_title: Forgery::LoremIpsum.title(random: true),
      address: Forgery::Address.street_address,
      latitude: 47.2268489,
      longitude: 39.7149856,
    }
  end

  describe "GET #index" do
    it "returns http redirect" do
      get :index
      expect(response.status).to eq(302)
    end
  end

  describe "POST #create" do
    login_user

    it "creates new event" do
      post :create, params: { event: @data }
      event = assigns(:event)
      expect(event.title).to eq(@title)
      expect(event.started_at).to eq(@started_at.utc)
    end

    it "populates event with place" do
      post :create, params: { event: @data }
      event = assigns(:event)
      expect(event.places.count).to eq(1)
    end

    it "links created event to organizer" do
      post :create, params: { event: @data }
      event = assigns(:event)
      expect(event.organizer).to eq(subject.current_user)
    end
  end
end
