feature 'Customer search' do
  def create_customer(first_name = nil, last_name = nil, email = nil)
    first_name ||= Faker::Name.first_name
    last_name ||= Faker::Name.last_name
    email ||= "#{Faker::Internet.user_name}#{rand(1000)}@" +
      "#{Faker::Internet.domain_name}"

    Customer.create!(
      {
        first_name: first_name,
        last_name: last_name,
        username: "#{Faker::Internet.user_name}#{rand(1000)}",
        email: email
      }
    )
  end

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
    create_customer('Robert', 'Aaron')
    create_customer('Bob', 'Johnson')
    create_customer('JR', 'Bob')
    create_customer('Bobby', 'Dobbs')
    create_customer('Bob', 'Jones', 'bob123@somewhere.net')

    visit '/customers'
    fill_in 'Email', with: 'bob@example.com'
    fill_in 'Password', with: 'password123'
    click_button 'Log in'
  end

  scenario 'Search by name' do
    within 'div.search-form' do
      fill_in 'keywords', with: 'bob'
    end
    within 'div.search-results' do
      expect(page).to have_content('Results')
      expect(page.all('ol li.list-group-item').count).to eq(4)

      expect(page.all('ol li.list-group-item')[0]).to have_content('JR')
      expect(page.all('ol li.list-group-item')[0]).to have_content('Bob')
      expect(page.all('ol li.list-group-item')[3]).to have_content('Bob')
      expect(page.all('ol li.list-group-item')[3]).to have_content('Jones')
    end
  end

  scenario 'Search by email' do
    within 'div.search-form' do
      fill_in 'keywords', with: 'bob123@somewhere.net'
    end
    within 'div.search-results' do
      expect(page).to have_content('Results')
      expect(page.all('ol li.list-group-item').count).to eq(4)

      expect(page.all('ol li.list-group-item')[0]).to have_content('Bob')
      expect(page.all('ol li.list-group-item')[0]).to have_content('Jones')

      expect(page.all('ol li.list-group-item')[1]).to have_content('JR')
      expect(page.all('ol li.list-group-item')[1]).to have_content('Bob')

      expect(page.all('ol li.list-group-item')[3]).to have_content('Bob')
      expect(page.all('ol li.list-group-item')[3]).to have_content('Johnson')
    end
  end
end
