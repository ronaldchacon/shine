Rails.application.routes.draw do
  get 'angular_test', to: "angular_test#index"
  resources :customers, only: [:index, :show]
  devise_for :users
  root 'dashboard#index'
end
