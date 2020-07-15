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
--set application.contentConfigMap=[Backend Release Name] \
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
--set application.contentConfigMap=[Backend Release Name] \
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
