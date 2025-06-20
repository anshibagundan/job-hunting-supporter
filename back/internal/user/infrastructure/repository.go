package infrastructure

import (
	"github.com/anshibagundan/job-hunting-supporter/internal/user/domain"
	"gorm.io/gorm"
)

type UserRepository struct {
	db *gorm.DB
}

func NewUserRepository(db *gorm.DB) *UserRepository {
	return &UserRepository{db: db}
}

func (r *UserRepository) Create(user *domain.User) error {
	return r.db.Create(user).Error
}

func (r *UserRepository) FindByID(id uint) (*domain.User, error) {
	var user domain.User
	err := r.db.First(&user, id).Error
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *UserRepository) GetAll() ([]*domain.User, error) {
	var users []*domain.User
	err := r.db.Find(&users).Error
	if err != nil {
		return nil, err
	}
	return users, nil
}

func (r *UserRepository) Update(user *domain.User) error {
	return r.db.Save(user).Error
}

func (r *UserRepository) Delete(id uint) error {
	return r.db.Delete(&domain.User{}, id).Error
}

func (r *UserRepository) FindByFirebaseUID(firebaseUID string) (*domain.User, error) {
	var user domain.User
	err := r.db.Where("firebase_uid = ?", firebaseUID).First(&user).Error
	if err != nil {
		return nil, err
	}
	return &user, nil
}
