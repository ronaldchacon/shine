Rails.application.routes.draw do
  get 'customers/index'

  resources :customers, only: [:index]
  devise_for :users
  root 'dashboard#index'
end
