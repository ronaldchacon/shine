feature 'angular test' do
  let(:email) { 'bob@example.com' }
  let(:password) { 'password123' }

  before do
    User.create!(
      {
        email: email,
        password: password,
        password_confirmation: password
      }
    )
  end

  scenario 'Our angular test app is working' do
    visit '/angular_test'

    # login
    fill_in "Email", with: 'bob@example.com'
    fill_in "Password", with: 'password123'
    click_button "Log in"

    # check that we go to the right page
    expect(page).to have_content("Name")

    # test the page
    fill_in "name", with: "Bob"
    within 'h1' do
      expect(page).to have_content("Hello, Bob")
    end
  end
end
