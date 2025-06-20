package controller

import (
	"github.com/anshibagundan/job-hunting-supporter/internal/job_events/domain"
	"github.com/anshibagundan/job-hunting-supporter/internal/job_events/usecase"
	"github.com/gin-gonic/gin"
	"strconv"
)

func NewJobEventController(useCase *usecase.JobEventUseCase) *JobEventController {
	return &JobEventController{useCase: useCase}
}

type JobEventController struct {
	useCase *usecase.JobEventUseCase
}

func (c *JobEventController) CreateJobEvent(ctx *gin.Context) {
	var jobEvent domain.JobEvent
	if err := ctx.ShouldBindJSON(&jobEvent); err != nil {
		ctx.JSON(400, gin.H{"error": "Invalid input"})
		return
	}

	if err := c.useCase.CreateJobEvent(&jobEvent); err != nil {
		ctx.JSON(500, gin.H{"error": "Failed to create JobEvent"})
		return
	}

	ctx.JSON(201, gin.H{"message": "JobEvent created successfully"})
}

func (c *JobEventController) GetJobEvent(ctx *gin.Context) {
	idStr := ctx.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		ctx.JSON(400, gin.H{"error": "Invalid JobEvent ID"})
		return
	}

	jobEvent, err := c.useCase.GetJobEvent(uint(id))
	if err != nil {
		ctx.JSON(404, gin.H{"error": "JobEvent not found"})
		return
	}

	ctx.JSON(200, jobEvent)
}

func (c *JobEventController) GetAllJobEvents(ctx *gin.Context) {
	jobEvents, err := c.useCase.GetAllJobEvents()
	if err != nil {
		ctx.JSON(500, gin.H{"error": "Failed to fetch JobEvents"})
		return
	}

	ctx.JSON(200, jobEvents)
}

func (c *JobEventController) UpdateJobEvent(ctx *gin.Context) {
	var jobEvent domain.JobEvent
	if err := ctx.ShouldBindJSON(&jobEvent); err != nil {
		ctx.JSON(400, gin.H{"error": "Invalid input"})
		return
	}

	if err := c.useCase.UpdateJobEvent(&jobEvent); err != nil {
		ctx.JSON(500, gin.H{"error": "Failed to update JobEvent"})
		return
	}

	ctx.JSON(200, gin.H{"message": "JobEvent updated successfully"})
}

func (c *JobEventController) DeleteJobEvent(ctx *gin.Context) {
	idStr := ctx.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		ctx.JSON(400, gin.H{"error": "Invalid JobEvent ID"})
		return
	}
	if err := c.useCase.DeleteJobEvent(uint(id)); err != nil {
		ctx.JSON(404, gin.H{"error": "JobEvent not found"})
		return
	}

	ctx.JSON(200, gin.H{"message": "JobEvent deleted successfully"})
}
