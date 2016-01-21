describe User do
  describe 'email' do
    let(:user) {
      User.create!(
        {
          email: 'foobar@example.com',
          password: 'password123',
          password_confirmation: 'password123'
        }
      )
    }
    it 'absolutely prevents invalid email addresses' do
      expect {
        user.update_attribute(:email, 'foo@bar.com')
      }.to violate_check_constraint(:email_must_be_company_email)
    end
  end
end
