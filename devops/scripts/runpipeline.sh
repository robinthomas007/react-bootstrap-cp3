#!/bin/bash

set -e

ENVIRONMENT=""
ENV=${ENV:-"dev"}
case "$ENV" in
    "dev") 
        export ENVIRONMENT="awsa1-hybrid-eks-dev/cp3-dev" 
        ;;
    "qa") 
        export ENVIRONMENT="awsa1-hybrid-eks-dev/cp3-qa" 
        ;;
    "uat") 
        export ENVIRONMENT="awsa2-hybrid-eks-uat/cp3-uat" 
        ;;
    "prod") 
        export ENVIRONMENT="awsa3-hybrid-eks-prod/cp3-prod" 
        ;;
esac

IMAGE_URL=${IMAGE_URL:-"docker-registry.umusic.com/cp3/cp3-web"}

export CLUSTER=`echo $ENVIRONMENT | cut -d/ -f1`
export NAMESPACE=`echo $ENVIRONMENT | cut -d/ -f2`
export ENV=`echo $NAMESPACE | awk -F'-' '{print $NF}'`
GIT_REF=${GIT_REF:-"$GITHUB_REF"}
GIT_COMMIT=${GIT_COMMIT:-"$GITHUB_SHA"}
PIPELINE=${PIPELINE:-"poc-vault"}
DOCKERFILE=${DOCKERFILE:-"devops/docker/Dockerfile"}
CONTEXT=${CONTEXT:-""}
YAML_PATH=${YAML_PATH:-"devops/app.yaml"}
YAML_DIR=${YAML_DIR:-"devops/k8s"}

IMAGE_TAG="$GIT_COMMIT-$ENV"

USER_DATA='{
    "VAULT_KV_PATH": "cp3/web/'$ENV'"
}'

USER_DATA=`echo "$USER_DATA" | base64`

cat > trigger.json <<-EOF
{
    "API": {
        "APIVersion": "v1",
        "Pipeline": "$PIPELINE"
    },
    "Git": {
        "Ref": "$GIT_REF",
        "Revision": "$GIT_COMMIT",
        "URL": "https://github.com/$GITHUB_REPOSITORY"
    },
    "Image": {
        "URL": "$IMAGE_URL",
        "Tag": "$IMAGE_TAG",
        "Dockerfile": "$DOCKERFILE",
        "Context": "$CONTEXT"
    },
    "K8S": {
        "YamlPath": "$YAML_PATH",
        "YamlDir": "$YAML_DIR",
        "Namespace": "$NAMESPACE",
        "ClusterName": "$CLUSTER"
    },
    "Config": {
        "VaultKVPath": "$VAULT_KV_PATH",
        "UserData": "$USER_DATA",
        "EventID": ""
    }
}
EOF

cat trigger.json

export EVENT_ID=`curl http://el-build-pipeline-listener.tekton-pipelines.svc.cluster.local:8080/v2/$PIPELINE \
    -d @trigger.json | jq -r '.eventID'`

echo Execution Logs: https://tekton.devops.umgapps.com/#/pipelineruns?labelSelector=triggers.tekton.dev%2Ftriggers-eventid%3D$EVENT_ID

tknwatch
