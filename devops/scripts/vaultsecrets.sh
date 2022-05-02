#!/bin/bash

# USER_DATA=base64({"VAULT_KV_PATH": ""})
USER_DATA=`echo "$USER_DATA" | base64 --decode`
echo "USER_DATA=$USER_DATA"

VAULT_KV_PATH=${VAULT_KV_PATH:-"`echo $USER_DATA | jq -r '.VAULT_KV_PATH'`"}

VAULT_ROLE=${VAULT_ROLE:-"cp3-cicd-reader"}
CLUSTER_NAME=${CLUSTER_NAME:-"aws44-devops-eks-prod-v3"}

# connect to vault and create token
export VAULT_ADDR=${VAULT_ADDR:-"https://vault.umusic.net"}
if [[ -f ~/.vault-token && -z $VAULT_TOKEN ]]; then
    VAULT_TOKEN=$(<~/.vault-token)
elif [[ -z "$VAULT_TOKEN" ]]; then
    echo auth to vault...
    KUBE_TOKEN=$(cat /var/run/secrets/kubernetes.io/serviceaccount/token)
    export VAULT_TOKEN=`curl --request POST \
        --data '{"jwt": "'"$KUBE_TOKEN"'", "role": "'"$VAULT_ROLE"'"}' \
        ${VAULT_ADDR}/v1/auth/${CLUSTER_NAME}/login | jq -r '.auth.client_token'`
    if [[ $? -gt 0 ]]; then
        echo login to vault failed
        exit 1
    fi
fi

if [[ -z "$VAULT_TOKEN" ]]; then
  echo "VAULT_TOKEN required"
  exit 1
fi

exportvaultdata() {
  echo "exportvaultdata $1" >&2
  VAULT_KV=$(echo $1 | awk -F'/' '{print $1}')
  VAULT_KV_PATH=$(echo $1 | sed "s,$VAULT_KV/,,g")
  VAULT_OUTPUT="`curl -s -H "X-Vault-Token: ${VAULT_TOKEN}" -X GET $VAULT_ADDR/v1/${VAULT_KV}/data/$VAULT_KV_PATH`"
  if [[ "$(echo $VAULT_OUTPUT | jq -r '.errors')" != "null" ]]; then
    echo Error from Vault $VAULT_ADDR/v1/${VAULT_KV}/data/${VAULT_KV_PATH}
    echo $VAULT_OUTPUT
    #exit 1
  fi
  while read line
  do 
    export "$line" 
  done < <(echo "$VAULT_OUTPUT" | jq -r '.data.data | to_entries|map("\(.key)=\(.value|tostring)")|.[]' | sed -Ee 's/([`$\\])/\\\1/g')
}

exportvaultdata $VAULT_KV_PATH
