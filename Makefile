build:
	docker build -t prisoner-content-hub-frontend . \
		--build-arg BUILD_NUMBER="$(BUILD_NUMBER)" \
		--build-arg GIT_REF="$(GIT_REF)" \
		--build-arg GIT_DATE="$(GIT_DATE)"

push:
	@docker login -u $(DOCKER_USERNAME) -p $(DOCKER_PASSWORD)
	docker tag prisoner-content-hub-frontend mojdigitalstudio/prisoner-content-hub-frontend:build-$(CIRCLE_BUILD_NUM)
	docker tag prisoner-content-hub-frontend mojdigitalstudio/prisoner-content-hub-frontend:latest
	docker push mojdigitalstudio/prisoner-content-hub-frontend:build-$(CIRCLE_BUILD_NUM)
	docker push mojdigitalstudio/prisoner-content-hub-frontend:latest

push-preview:
	@docker login -u $(DOCKER_USERNAME) -p $(DOCKER_PASSWORD)
	docker tag prisoner-content-hub-frontend mojdigitalstudio/prisoner-content-hub-frontend:preview
	docker push mojdigitalstudio/prisoner-content-hub-frontend:preview

