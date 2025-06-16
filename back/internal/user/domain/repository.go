package domain

type UserRepository interface {
	Create(user *User) error
	FindByID(id uint) (*User, error)
	GetAll() ([]*User, error)
	Update(user *User) error
	Delete(id uint) error
}
