# Prisoner Content Hub Frontend Chart

## Prerequisites

**Helm 3**

Documentation for installing Helm can be found [here](https://helm.sh/docs/intro/quickstart/#install-helm)

## Dependencies

```
- Elasticsearch >= 7
- Prisoner Content Hub Backend
```

## Deployment

**Note:** The assumption is made that Helm is installed and your `kubectl` context is appropriately configured.

### Values files

There are three tiers of yaml files containing configuration values. These are:
1. `values.yaml`, the default values applied to all the things
2. `values.<environment>.yaml`, where `<environment>` is one of:
  - one of the non-development Cloud Platform namespaces `production` or `staging`, **or**
  - `development.<a unique name>` for shorter-lived development environments, e.g. `development.unicornsetup`, **or**
  - `local`, for local development
3. `values.establishment-<establishment name>.yaml` for individual prisons/YOIs, where `establishment-name` is meaningful, e.g. `cookhamwood`.

### Testing the release

```
helm upgrade [Release Name] . \
--install --dry-run --debug \
--namespace [Kubernetes Namespace] \
--values values.establishment-[establishment name].yaml \
--values values.[environment].yaml \
--values secrets.yaml \
--set application.contentConfigMapName=[Backend Release Name] \
--set application.nprConfigMapName=[NPR Proxy config map name] \
--set cacheSecret=[32Byte string used for encrypting cached items] \
--set feedbackDatabaseName=[RDS Database Name] \
--set feedbackDatabaseUrl=[RDS Database Name Address] \
--set feedbackDatabaseUserName=[RDS Database Username] \
--set feedbackDatabasePassword=[RDS Database Password] \
--set image.tag=[Image Tag]
```

The computed values and generated output will be displayed

### Perform the release

Once tested and verified the release can be performed using the following

```
helm upgrade [Release Name] . \
--install --wait \
--namespace [Kubernetes Namespace] \
--values values.establishment-[establishment name].yaml \
--values values.[environment].yaml \
--values secrets.yaml \
--set application.contentConfigMapName=[Backend Release Name] \
--set application.nprConfigMapName=[NPR Proxy config map name] \
--set cacheSecret=[32Byte string used for encrypting cached items] \
--set feedbackDatabaseName=[RDS Database Name] \
--set feedbackDatabaseUrl=[RDS Database Name Address] \
--set feedbackDatabaseUserName=[RDS Database Username] \
--set feedbackDatabasePassword=[RDS Database Password] \
--set image.tag=[Image Tag]
```

### Rolling back releases

To list releases on the Namespace

```
helm --namespace [Kubernetes Namespace] list
```

View the revisions for a release

```
helm --namespace [Kubernetes Namespace] history [Release Name]
```

To rollback to a revision of a release

```
helm--namespace [Kubernetes Namespace] --wait rollback [Release Name] [Revision]
```

# Adding namespace contexts to CircleCI

We specify Kubernetes connection details and the target namespace using CircleCI contexts. This allows us to expose them as environment variables, and reuse the set across different jobs. It also helps keep environments separate, so the chance of erroneously deploying to production because of a typo is reduced.

## Setting up namespaces in CircleCI
We isolate namespace credentials as "contexts" in CircleCI.

1. Go to the [context management page for Ministry of Justice organisation](https://app.circleci.com/settings/organization/github/ministryofjustice/)
2. Create a new context:
  a. Remove the `All members` security group, and add `Prisoner Content Hub developers`.
  b. Add the environment variables


### Environment variables to add

Kubernetes cluster connection details. See [here](https://user-guide.cloud-platform.service.justice.gov.uk/documentation/deploying-an-app/using-circleci-for-continuous-deployment.html#requirements) for steps to extract these from Cloud Platform.

- `KUBE_CLUSTER_NAME=live.cloud-platform.service.justice.gov.uk`
- `KUBE_NAMESPACE`
- `KUBE_CLUSTER_CERT`
- `KUBE_TOKEN `

> You can retrieve these from the cluster using `kubectl get secrets -n <namespace>` to retrieve the secret name for the CircleCI token, and then:
```
kubectl get secrets -n <namespace> <secret-name> -o json | jq " .data | map_values(@base64d)
```

We also add an app-specific environment variable:

- `HELM_BACKEND_RELEASE_NAME=prisoner-content-hub-backend`

> `HELM_BACKEND_RELEASE_NAME` can be set to anything, but needs to match between frontend and CMS deploys so they are wired up correctly.
