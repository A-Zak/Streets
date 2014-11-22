#!/bin/zsh

CLUSTER_NAME="streets-cluster"
ZONE="europe-west1-b"
echo $CLUSTER_NAME @ $ZONE
# gcloud preview container clusters --zone $ZONE create $CLUSTER_NAME
# gcloud preview container clusters --zone $ZONE delete $CLUSTER_NAME
# gcloud preview container clusters --zone $ZONE list



# # create the mongo controller
# gcloud preview container replicationcontrollers \
# 		--cluster-name $CLUSTER_NAME \
#     --zone $ZONE \
# 			create \
#     --config-file ./mongo-master-controller.json


# # create the mongo service
# gcloud preview container services --cluster-name $CLUSTER_NAME  \
#     --zone $ZONE \
#     create \
#     --config-file ./mongo-master-service.json


# # open a port in the firewall
# gcloud compute firewall-rules create $CLUSTER_NAME-node-27017 --allow=tcp:27017 \
#     --target-tags k8s-$CLUSTER_NAME-node







# # delete the streets controller
# gcloud preview container replicationcontrollers --cluster-name $CLUSTER_NAME \
#     --zone $ZONE \
#     delete streets-controller


# # create the streets controller
# gcloud preview container replicationcontrollers --cluster-name $CLUSTER_NAME \
#     --zone $ZONE \
#     create \
#     --config-file ./streets-controller.json






# # delete the streets service
# gcloud preview container services --cluster-name $CLUSTER_NAME  \
#     --zone $ZONE \
#     delete streets

# # create the streets service
# gcloud preview container services --cluster-name $CLUSTER_NAME  \
#     --zone $ZONE \
#     create \
#     --config-file ./streets-service.json


# # list the services
# gcloud preview container services --cluster-name $CLUSTER_NAME  \
#     --zone $ZONE \
#     list



# gcloud compute forwarding-rules list







# # open a port in the firewall
# gcloud compute firewall-rules create $CLUSTER_NAME-node-80 --allow=tcp:80 \
#     --target-tags k8s-$CLUSTER_NAME-node

# # open a port in the firewall
# gcloud compute firewall-rules create $CLUSTER_NAME-node-3000 --allow=tcp:3000 \
#     --target-tags k8s-$CLUSTER_NAME-node

# # open a port in the firewall
# gcloud compute firewall-rules create $CLUSTER_NAME-node-80 --allow=tcp:80 \
#     --target-tags k8s-$CLUSTER_NAME-node

# # open a port in the firewall
# gcloud compute firewall-rules create $CLUSTER_NAME-node-8080 --allow=tcp:8080 \
#     --target-tags k8s-$CLUSTER_NAME-node

# # un-open a port in the firewall
# gcloud compute firewall-rules delete $CLUSTER_NAME-node-3000
# gcloud compute firewall-rules delete $CLUSTER_NAME-node-80
# gcloud compute firewall-rules delete $CLUSTER_NAME-node-8080
# gcloud compute firewall-rules delete $CLUSTER_NAME-node-5555




# gcloud compute firewall-rules list









# list pods
gcloud preview container pods --cluster-name $CLUSTER_NAME  \
    --zone $ZONE \
    list

# # list services
# gcloud preview container services --cluster-name $CLUSTER_NAME  \
#     --zone $ZONE \
#     list















# CLUSTER_NAME="streets-cluster"
# ZONE="europe-west1-b"
# echo $CLUSTER_NAME @ $ZONE
# gcloud preview container clusters --zone $ZONE create $CLUSTER_NAME


# # create the streets controller
# gcloud preview container replicationcontrollers --cluster-name $CLUSTER_NAME \
#     --zone $ZONE \
#     create \
#     --config-file ./streets-controller.json

# # {
# #   "apiVersion": "v1beta1",
# #   "kind": "ReplicationController",
# #   "id": "streets-controller",
# #   "desiredState": {
# #     "replicas": 3,
# #     "replicaSelector": { "name": "streets" },
# #     "podTemplate": {
# #       "desiredState": {
# #         "manifest": {
# #           "version": "v1beta1",
# #           "id": "streets-controller",
# #           "containers": [{
# #             "image": "alexzak/streets:1.1.0",
# #             "name": "streets",
# #             "ports": [{ "name": "http-server", "containerPort": 3000, "hostPort": 80 }]
# #           }],
# #         }
# #       },
# #       "labels": { "name": "streets" }
# #     },
# #   },
# #   "labels": { "name": "streets" }
# # }




# # create the streets service
# gcloud preview container services --cluster-name $CLUSTER_NAME  \
#     --zone $ZONE \
#     create \
#     --config-file ./streets-service.json

# # {
# #   "apiVersion": "v1beta1",
# #   "kind": "Service",
# #   "id": "streets",
# #   "port": 80,
# #   "containerPort": 80,
# #   "selector": { "name": "streets" },
# #   "createExternalLoadBalancer": true
# # }


# # open a port in the firewall
# gcloud compute firewall-rules create $CLUSTER_NAME-node-80 --allow=tcp:80 \
#     --target-tags k8s-$CLUSTER_NAME-node



