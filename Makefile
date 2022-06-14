build:
	docker build -t prisoner-content-hub-frontend . \
		--build-arg BUILD_NUMBER="$(APP_VERSION)" \
		--build-arg GIT_REF="$(GIT_REF)" \
		--build-arg GIT_DATE="$(GIT_DATE)"

push:
	@docker login -u="${QUAYIO_USERNAME}" -p="${QUAYIO_PASSWORD}" quay.io
	docker tag prisoner-content-hub-frontend quay.io/hmpps/prisoner-content-hub-frontend:$(APP_VERSION)
	docker tag prisoner-content-hub-frontend quay.io/hmpps/prisoner-content-hub-frontend:latest
	docker push quay.io/hmpps/prisoner-content-hub-frontend:$(APP_VERSION)
	docker push quay.io/hmpps/prisoner-content-hub-frontend:latest

push-preview:
	@docker login -u="${QUAYIO_USERNAME}" -p="${QUAYIO_PASSWORD}" quay.io
	docker tag prisoner-content-hub-frontend quay.io/hmpps/prisoner-content-hub-frontend:$(APP_VERSION)
	docker push quay.io/hmpps/prisoner-content-hub-frontend:$(APP_VERSION)

