package usecase

import (
	"github.com/anshibagundan/job-hunting-supporter/internal/user/domain"
)

func NewUserUseCase(repo domain.UserRepository) *UserUseCase {
	return &UserUseCase{
		repo: repo,
	}
}

type UserUseCase struct {
	repo domain.UserRepository
}

func (u *UserUseCase) CreateUser(user *domain.User) error {
	return u.repo.Create(user)
}

func (u *UserUseCase) GetUser(id uint) (*domain.User, error) {
	return u.repo.FindByID(id)
}

func (u *UserUseCase) GetAllUsers() ([]*domain.User, error) {
	return u.repo.GetAll()
}

func (u *UserUseCase) UpdateUser(user *domain.User) error {
	return u.repo.Update(user)
}

func (u *UserUseCase) DeleteUser(id uint) error {
	return u.repo.Delete(id)
}

func (u *UserUseCase) GetUserByFirebaseUID(firebaseUID string) (*domain.User, error) {
	return u.repo.FindByFirebaseUID(firebaseUID)
}
